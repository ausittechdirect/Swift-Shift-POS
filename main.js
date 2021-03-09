const { app, BrowserWindow, ipcMain, screen  } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width,
    height,
    //frame: false,
    //fullscreen : true,
    //fullscreenWindowTitle : true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    setInterval(function(){ autoUpdater.checkForUpdatesAndNotify();
      mainWindow.webContents.send('checking_for_updates');
    }, 60000);

  });
}
app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('close-me', (evt, arg) => {
  app.quit()
})
