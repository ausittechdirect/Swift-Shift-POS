
var installdb = new PouchDB('http://localhost:5984/posinstall',{skipSetup: true,auth:{username:'admin',password:'admin',},});
var settingsdb = new PouchDB('http://localhost:5984/posqsettings',{skipSetup: true,auth:{username:'admin',password:'admin',},});

var brandsdb = new PouchDB('http://localhost:5984/posbrands',{skipSetup: true,auth:{username:'admin',password:'admin',},});


var productsdb = new PouchDB('http://localhost:5984/posqproducts',{skipSetup: true,auth:{username:'admin',password:'admin',},});
var keypadsdb = new PouchDB('http://localhost:5984/posqkeypads',{skipSetup: true,auth:{username:'admin',password:'admin',},});
var staffdb = new PouchDB('http://localhost:5984/posqstaff',{skipSetup: true,auth:{username:'admin',password:'admin',},});
var customerdb = new PouchDB('http://localhost:5984/posqcustomers',{skipSetup: true,auth:{username:'admin',password:'admin',},});

var tablesdb = new PouchDB('http://localhost:5984/postables',{skipSetup: true,auth:{username:'admin',password:'admin',},});
//var tabledb = new PouchDB('http://192.168.0.99:5984/postable',{skipSetup: true,auth:{username:'admin',password:'admin',}});

var ejtabledb = new PouchDB('http://localhost:5984/posqejtable',{skipSetup: true,auth:{username:'admin',password:'admin',},});
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

function printlastreceipt(){

  let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'tcp://192.168.1.185:9100'
  });

  printer.alignCenter();
  printer.println("Hello world");
  printer.cut();

  try {
  let execute = printer.execute()
  console.error("Print done!");
  } catch (error) {
  console.log("Print failed:", error);
  }

      }


      function createvoucher(){
      let unifi = require('node-unifiapi');
      let r = unifi({
          baseUrl: 'https://localhost:8443', // The URL of the Unifi Controller
          username: 'AUSITTECHDIRECT',
          password: '#Au5T3chGR0up#',
          // debug: true, // More debug of the API (uses the debug module)
          // debugNet: true // Debug of the network requests (uses request module)
      });
      r.create_voucher(1, 2880, 1, 'Test vouchers', 1000, 2000, 250)
    .then(function (done){
    var createtime = done.data[0].create_time;
    r.stat_voucher(createtime)
    .then(function (done){
    var voucher = done.data[0].code;
    alert(voucher);
  })
    .catch(err => console.log('Error',err))
  })
    .catch(err => console.log('Error',err))




        }

  function loadliccheck(){

    function uuid() {
      var uuid = "", i, random;
      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
          uuid += "-";
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
      }
      return(uuid);
    }

  installdb.info().then(function (info) {
      console.log(info);
      if (info.doc_count == "0"){
        var installdoc = {
          "_id": "1",
          "terminalUUID": uuid(),
          "vendorUUID": "1"
        };
        installdb.put(installdoc);
      }
    })
  settingsdb.info().then(function (info) {
    console.log(info);
  })
  productsdb.info().then(function (info) {
    console.log(info);
  })
  keypadsdb.info().then(function (info) {
    console.log(info);
  })
  staffdb.info().then(function (info) {
    console.log(info);
  })
  customerdb.info().then(function (info) {
    console.log(info);
    customerdb.createIndex({
    index: {fields: ['customerName','customerEmail','customerPhone']}
  });

  })
  tablesdb.info().then(function (info) {
    console.log(info);
  })
  ejtabledb.info().then(function (info) {
    console.log(info);
  })
  var settingsdoc = {
    "_id": "1",
    "terminalLIC": "123456789",
    "terminalID": "1",
    "brand": [
    {storeName:'AUS Host',storeAbn:'55 640 752 991',storePhone:'1234567678',storeAddress:'50 Alistair st Toowoomba 4350',storeLogo:''},
    {storeName:'AUS IT TECH DIRECT',storeAbn:'55 640 752 991',storePhone:'1234567678',storeAddress:'50 Alistair st Toowoomba 4350',storeLogo:''},
    {storeName:'AUS IT TECH DIRECT',storeAbn:'55 640 752 991',storePhone:'1234567678',storeAddress:'50 Alistair st Toowoomba 4350',storeLogo:''}
    ],
    "tablesActive": "1",
    "tablesMasterIP": "",
    "eftIntergrated": "0",    //0=NO,1=TYRO,2=LINKLY
  };
  settingsdb.put(settingsdoc);



  setTimeout(function(){ postload(); }, 3000);

  };



  function deletedatabase(){
  new PouchDB('http://localhost:5984/posqsettings',{skipSetup: true,auth:{username:'admin',password:'admin',},}).destroy().then(function () {
  loadliccheck();
  }).catch(function (err) {
    // error occurred
  })
  }




  function checklicence(){
  post_data = {'lickey': $("#lickey").val()};
              //Ajax post data to server
  $.post('https://viewmynewsite.com.au/zread/webserviceV1/updatesubscription.php', post_data, function(response){

  if(response.type == 'error'){

  output = '<div class="error">'+response.text+'</div>';
  }else{

  }
  }, 'json');
  };


  function postload(){
  updateTemp();
  settingsdb.get('1').then(function (doc) {
  var datatablestatus = doc.tablesActive;
  if (datatablestatus = '1'){
  $(".tableactive").show();
  $(".tabledeactive").hide();
  }else{
  $(".tableactive").hide();
  $(".tabledeactive").show();
  }
  });
  getattachment('0');
  }

  function getDateTime() {
          var now     = new Date();
          var year    = now.getFullYear();
          var month   = now.getMonth()+1;
          var day     = now.getDate();
          var hour    = now.getHours();
          var minute  = now.getMinutes();
          var second  = now.getSeconds();
          if(month.toString().length == 1) {
               month = '0'+month;
          }
          if(day.toString().length == 1) {
               day = '0'+day;
          }
          if(hour.toString().length == 1) {
               hour = '0'+hour;
          }
          if(minute.toString().length == 1) {
               minute = '0'+minute;
          }
          if(second.toString().length == 1) {
               second = '0'+second;
          }
  		if(minute == "00" && second == "00") {
             updateTemp();
          }
  		if(minute == "05" && second == "00") {
             updateTemp();
          }
  		if(minute == "10" && second == "00") {
             updateTemp();
          }
  		if(minute == "15" && second == "00") {
             updateTemp();
          }
  		if(minute == "20" && second == "00") {
             updateTemp();
          }
  		if(minute == "25" && second == "00") {
             updateTemp();
          }
  		if(minute == "30" && second == "00") {
             updateTemp();
          }
  		if(minute == "35" && second == "00") {
             updateTemp();
          }
  		if(minute == "40" && second == "00") {
             updateTemp();
          }
  		if(minute == "45" && second == "00") {
             updateTemp();
          }
  		if(minute == "50" && second == "00") {
             updateTemp();
          }
  		if(minute == "55" && second == "00") {
             updateTemp();
          }

          var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;

           return dateTime;
      }

      // example usage: realtime clock
      setInterval(function(){
        alert('test');
          currentTime = getDateTime();
          document.getElementById("digital-clock").innerHTML = currentTime;
      }, 1000);

      function updateTemp(){
  	   var apikey = "8c76c40f692047d5a1b5f35ade822168";
  	   var position =  "27.5670,151.8970";
  	   $.ajax({
  	   		url: "https://api.darksky.net/forecast/" + apikey + "/" + position + "?extend=hourly&units=si&callback=?",
              type: 'GET',
              dataType: 'jsonp',
              success: function(result){
  			var translateIcon = function (iconCode) {
              switch (iconCode) {
                  case "clear-day":
                      return "sunny";
                  case "clear-night":
                      return "moon";
                  case "partly-cloudy-night":
                      return "cloudynight";
                  case "partly-cloudy-day":
                  case "wind":
                      return "mostlycloudy";
                  case "cloudy":
                      return "cloudy";
                  case "rain":
                      return "drizzle";
                  case "snow":
                      return "snow";
                  case "sleet":
                      return "drizzlesnow";
                  case "fog":
                      return "haze";
                  default:
                      return "sunny";
              }
          };
  			var weather = ('Currently : ' + result.currently.temperature + ' Degrees - Forcast ' + result.currently.summary + '<img src="img/weather/'+ translateIcon(result.currently.icon) + '.png" style="width: 5%;" />');
  			$('.storagedata').html(weather);
    			}
    			});
      };

  //LOAD QTY/BARCODE MODAL START
  (function() {
  $("#barcode").click(function() {
  $( "#barcode" ).val('');
  $( "#qtytempfield" ).val('');
  $("#customer-modal-content").modal({
    minHeight:390
  });
  $('#qtykeyboard').jkeyboard({
  layout: "english_capital",
  input: $('#qtytempfield'),
  customLayouts: {
  selectable: ["english_capital"],
  english_capital: [
  ['7', '8', '9',],
  ['4', '5', '6',],
  ['1', '2', '3',],
  ['0', '.', 'backspace']
  ],
  }
  });
  }).blur(function() {
  });
  })();
  //LOAD QTY/BARCODE MODAL END

  //LOAD QTY TO FIELD START
  function enterqty(){
  var qtytempfield = $( "#qtytempfield" ).val();
  $( "#barcode" ).val(qtytempfield);
  $( "#qtytempfield" ).val('');
  $.modal.close();
  if(qtytempfield.length > 7) {
  //BARCODE
  getplu(qtytempfield);
  } else {
  //QTY
  }
  $( "#barcode" ).focus();
  }
  //LOAD QTY TO FIELD END

  //BARCODE FIELD LOOKUP ON ENTER START
  $( "#barcode" ).focus();
  $(document).on('keypress',function(e) {
  if(e.which == 13) {
  $( "#barcode" ).focus();
  getplu($( "#barcode" ).val());
  $( "#barcode" ).val('');
  }
  });
  //BARCODE FIELD LOOKUP ON ENTER END

  //OPEN CANCEL PANEL START
  function opencancelpanel(){
  $("#basic-modal-content").modal({
  minHeight:150,
  minWidth: 330
  });
  }
  //OPEN CANCEL PANEL END

  //CLOSE CANCEL PANEL START
  function closecancelpanel(){
  $.modal.close();
  }
  //CLOSE CANCEL PANEL END

  //CANCEL SALE START
  function cancelsale(){
  	  $('#barcode').val('');
  	  $( '#customerpanel').val('');
  		$( "#barcode" ).focus();
  		$(".journal ul li").remove();
  		$('.simpleCart_total').val('0.00');
  		$('.tablenum').hide();
  		$( ".tablenum span" ).text("");
  		$( ".parkkey" ).text('TABLES');
      getattachment('0');
      $.modal.close();
  };
  //CANCEL SALE END

  //OPEN & SAVE TABLES START
  function tablepanel(innertext){
  if (innertext == "PARK"){
  $( "#tabletempfield" ).val('');
  $("#table-save-modal-content").modal({
    minHeight:390
  });
  $('#tablekeyboard').jkeyboard({
  layout: "english_capital",
  input: $('#tabletempfield'),
  customLayouts: {
  selectable: ["english_capital"],
  english_capital: [
  ['7', '8', '9',],
  ['4', '5', '6',],
  ['1', '2', '3',],
  ['0', '.', 'backspace']
  ],
  }
  });
  }else if(innertext == "TABLES"){
  $("#table-lookup-modal-content").modal({
    minHeight:400,
  	minWidth: 600
  });
  }else{
  //SAVING THE ORDER TO THE TABLE DB
  $('.tablenum').hide();
  $( ".tablenum span" ).text("");
  $( ".parkkey" ).text('PARK');
  }
  };

  function entertable(){
  var tabletempfield = $( "#tabletempfield" ).val();
  if (tabletempfield == ""){
  $.modal.close();
  $( "#tabletempfield" ).val("");
  }else{
  $('.tablenum').show();
  $( ".tablenum span" ).text(tabletempfield);
  $( ".parkkey" ).text('SAVE');
  $( "#tabletempfield" ).val("");
  $.modal.close();
      }
  }
  //OPEN & SAVE TABLES END

  //JOURNAL FUNCTIONS START
  function cancelitem(){
  $(".journal ul li[data-att=selected]").remove();
  var sumofvals = [];
  var listItems = $(".journal ul li");
  if(listItems.length == "0"){
  $.modal.close();
  $('.simpleCart_total').val('0.00');
  }else{
  listItems.each(function(idx, li) {
  var product = $(li);
  var res = $(product).data('price');
  sumofvals.push(res);
  });
  var total = eval(sumofvals.join("+")).toFixed(2);
  $.modal.close();
  $('.simpleCart_total').val(total);
  }
  };
  //JOURNAL FUNCTIONS END

  //CLOSE CANCEL ITEM PANEL START
  function closecancelitempanel(){
  $("#myid li").attr("data-att","");
  $("#myid li").css("background-color" , "transparent");
  $.modal.close();
  }
  //CLOSE CANCEL ITEM PANEL END

  $(".journal ul").on('click', 'li', function(e) {
  $("#cancel-item-modal-content").modal({
  minHeight:150,
  minWidth: 330
  });
  $(".journal ul li").attr("data-att","");
  $(".journal ul li").css("background-color" , "transparent");
  $(this).css("background-color" , "red");
  $(this).attr("data-att","selected");
  });

  //ADD PRODUCT TO SALE START
  function getplu(id){

  var qty = $( "#barcode" ).val();
  if (!qty){
    var qty = 1;
  }else{
  var n = $( "#barcode" ).val().replace(/\s+/g, '').length;
  if (n < 7 ){
  var qty = $( "#barcode" ).val();
  }else{
    var qty = 1;
  }
  }



    const port = new SerialPort("COM1", {baudRate:9600, dataBits:7, stopBits:1, parity:"even"})
    const parser = new Readline()
    port.write('<W>\r')
    port.pipe(parser)
    parser.on('data', function (data) {
      var weight = data.toString('utf8');
      var weight = weight.replace("KG", "");
      productsdb.get(id).then(function (doc) {
      var productSKU = doc.productSKU;
      var productName = doc.productName;
      var productPrice = doc.productPrice;
      var productGST = doc.productGST;
      var productWeighted = doc.productWeighted;
      var productPrice = (productPrice * weight).toFixed(2);
      var qty = 1;
      $(".journal ul").append('<li data-plu="'+productSKU+'" data-price="'+productPrice+'" data-qty="'+qty+'" data-gst="'+productGST+'" data-att="">'+qty+' x '+productName+'<span>$'+productPrice+' </span></li>');

        $( "#barcode" ).val('');
        $( ".parkkey" ).text('PARK');
        var wtf    = $('.journal');
        var height = wtf[0].scrollHeight;
        wtf.scrollTop(height);
        var sumofvals = [];
        var listItems = $(".journal ul li");
        listItems.each(function(idx, li) {
        var product = $(li);
        var res = $(product).data('price');
        sumofvals.push(res);
        });
        var total = eval(sumofvals.join("+")).toFixed(2);
        $('.simpleCart_total').val(total);

    });
    port.close()
    });





  }
  //ADD PRODUCT TO SALE END

  //OPEN CUSTOMER SEARCH PANEL START



  function customerpanel(){
    $("#customer-search-modal-content").modal({
    minHeight:680,
    minWidth: 750
    });
    $( "#customertempfield" ).val('');
    $('#customerkeyboard').jkeyboard({
    layout: "english",
    input: $('#customertempfield'),
    });



  };
  function findcust(){
  var searchcust = $( "#customertempfield" ).val();


  };
  //OPEN CUSTOMER SEARCH PANEL END

  //CLOSE CUSTOMER SEARCH PANEL START
  function closecustomerpanel(){
  $.modal.close();
  }
  //CLOSE CUSTOMER SEARCH PANEL END





  $('.keyboard .key').click(function() {
      var text = $(this).text();
      if (text == "ENTER"){
      var currenttext = $( "#keyboardinput" ).val();
      	$( "#customerpanel" ).text(currenttext);
      	$( "#keyboardinput" ).val('');

      }else{
      var currenttext = $( "#keyboardinput" ).val();
  	var newtext = currenttext + text ;
  	$( "#keyboardinput" ).val(newtext);
      // do something with the text
      }
  });
  $('.staffpin .key').click(function() {
      var text = $(this).text();
      if (text == "ENTER"){
      var enteredpin = $( "#staffinput" ).val();
      var pintomatch = $( "#staffpintomatch" ).val();
  	var staffname = $( "#staffname" ).val();
     if (pintomatch === enteredpin){
     $('#staffmember').text(staffname);
     $('#staffpintomatch').val('');
     $( "#staffinput" ).val('');
     $( "#staffname" ).val('');
     $('#staffpin').modal('hide');
      	$( "#staffinput" ).css("background-color" , "white");
     }else{
      	$( "#staffinput" ).val('');
      	$( "#staffinput" ).css("background-color" , "yellow");
     }

      }else if (text == "CANCEL"){
      	$( "#staffinput" ).css("background-color" , "white");
      	$( "#staffinput" ).val('');
  	$('#staffpintomatch').val('');
  	$('#staffModal').modal({
  	backdrop: 'static',
  	keyboard: false
  	});
  	$('#staffpin').modal('hide');
      }else{
      var currenttext = $( "#staffinput" ).val();
  	var newtext = currenttext + text ;
  	$( "#staffinput" ).val(newtext);
      // do something with the text
      }
  });


  //OPEN STAFF PANEL START

  function staffpanel(){
  	$('#staffModal').modal({
      		backdrop: 'static',
      		keyboard: false
  		});
  		$('.staffpanel ul li').click(function() {
  		var staffid = $(this).data('id');
  		var staffname = $(this).data('staffname');
  		var staffpin = $(this).data('pin');
  		if (!staffpin){
  		$('#staffmember').text(staffname);
  		$('#staffModal').modal('hide');
  		}else{
  		$('#staffModal').modal('hide');
  		$('#staffpin').modal({
      		backdrop: 'static',
      		keyboard: false
  		});
  		$('#staffpintomatch').val(staffpin);
  		$('#staffname').val(staffname);
  		}
  		});

  };
  //OPEN STAFF PANEL END







  $('.but2').click(function() {
  		if (this.id == "butrec"){
  		printlastreceipt();
  		}else if(this.id == "cash"){
  		$('#finaliseModal').modal({
      		backdrop: 'static',
      		keyboard: false
  		});
  		}else{
  		$( "#barcode" ).focus();
  		}
  });



  function getattachment(keyid){
  keypadsdb.get('1').then(function (doc) {
  var layoutdata = doc.layoutdata[keyid].val;
  var layout = document.getElementById("layout");
  layout.innerHTML = "";
  layout.innerHTML = layout.innerHTML + layoutdata;
  });
  };

  function butblick() {
  	var res = event.srcElement.id;
  	if (res.charAt(0) == 'l'){
  	getattachment(res.substring(2));
  	}else if (res.charAt(0) == 'p'){
  	getplu(res.substring(2));
  	}
  };




  function attachment(){
  	var layouts = {
    "_id": "1",
    "layoutdata": [{"id": '0',
    "val":'<div class="col-sm-2 butholder"><div id="l-1" onclick="butblick()" class="but">Latout 2</div></div>'
  },{   "id": '1',
     "val":'<div><div id="p-13992" class="col-sm-2 butholder" onclick="butblick()">Bacon and Egg</div></div><div class="col-sm-2 butholder"><div id="l-0" onclick="butblick()" class="but">Layout 1</div></div>'
  }]
  }
  keypadsdb.put(layouts);
  }










  //////LOAD STAFF////////
  var datastring = localStorage.getItem('staff');

  $(jQuery.parseJSON(datastring)).each(function() {
      var ID = this.plu;
  	    $(".staffpanel ul").append('<li data-id="'+this.id+'" data-staffname="'+this.staffname+'" data-pin="'+this.pin+'"  >'+this.staffname+'</li>');


  });


  //////UPDATE PLU DATA FROM CLOUD//////////

  function addplu(){
  	var layout =
  		[
  		{
  		plu:'13992',productname:'Bacon and Eggs',gstfree:'^',price:'10.00'
  		},
  		{
  		plu:'93633000',productname:'Big Burger',gstfree:'^',price:'14.95'
  		}
  		]
  		localStorage.setItem('products',JSON.stringify(layout));
  }
  //////UPDATE STAFF DATA FROM CLOUD//////////

  function addstaff(){
  	var layoutstaff =
  		[
  		{
  		id:'1234',staffname:'Matt',pin:'1234'
  		},
  		{
  		id:'1234',staffname:'Candice',pin:''
  		}
  		]
  		localStorage.setItem('staff',JSON.stringify(layoutstaff));
  }
  function addej(){
  	var ejobj =
  		[
  		]
  		localStorage.setItem('ej',JSON.stringify(ejobj));
  }

  //////UPDATE EJ TABLE//////////











  function addsale(eft,val){

  ejtabledb.allDocs({
    descending: true,
    limit: 1
  }).then(function (doc) {
  		if (doc.total_rows == "0"){
  		var newrecnum = '1';
  		}else{
  		var objectlastrecnum = doc.rows[0].id;
  		var newrecnum = +objectlastrecnum + 1;
  		var newrecnum = ''+newrecnum+'';
  		}
  		savesale(newrecnum);
  }).catch(function (err) {
    console.log(err);
  });



  }

  function savesale(recnum){
  var currentDate = new Date().toLocaleString("en-US", {timeZone: "Australia/Brisbane"})
  var saledoc = {
    "_id": recnum,
    "recnum": recnum,
    "datetime": currentDate,
    "receiptgst": '250.00',
    "receipttotal": '2500.00',
    "clerk": "Matt",
    "items": [{plu:'13992',productname:'Bacon and Eggsre',gstfree:'^',price:'10.00'},{plu:'210492',productname:'Big Burger',gstfree:'^',price:'14.95'},{plu:'210492',productname:'Lasagna',gstfree:'',price:'20.00'},{plu:'210492',productname:'Carrots',gstfree:'',price:'3.00'}],
    "eftrec": ''
  };
  ejtabledb.put(saledoc);

  	}
