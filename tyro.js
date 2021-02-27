
var iclient = new TYRO.IClient("anyApiKey", {posProductVendor: "demoVendor", posProductName: "demoName", posProductVersion: "demoVersion"});

function purchase() {
$('#eftposModal').modal('show');
	    var purval = $( "#barcode" ).val();
	    if (!purval){
		var purval = $('.simpleCart_total').val();
		var purval = purval.replace(".", "");
	    }else{
		var purval = $('#barcode').val();
		var purval = purval.replace(".", "");
	    }
   reset();
    doPurchase(purval);
}

function refund() {
    reset();
    doRefund($("#amount").val());
}

function reset() {
	$(".caneft").show();
    $("#statusMessage").html("");
    $("#merchantReceipt").html("Merchant Receipt");
    $("#customerReceipt").html("Customer Receipt");
    $("#result").html("Result");
}
var statusMessageCallbackImpl = function (message) {
    $("#statusMessage").text(message);
                	  //  $('#eftposModal').modal('hide');

};
var questionCallbackImpl = function (question, answerCallback) {
			$(".btns").html("");
			$(".caneft").hide();
			    $("#statusMessage").text("Are you sure you want to cancel?");

			
    $.each(question.options, function(index, option) {
        $(".btns").append("<button type=\"button\" id=\"btn" + index + "\" class=\"btn btn-sm btn-primary\">" + option + "</button>&nbsp;");
        $("#btn" + index).click(function(){
	        if(option == "NO"){
		     	$(".caneft").show();   
	        }
            $(".btns").html("");
            answerCallback(option);

        });
    });
};
var receiptCallbackImpl = function (receipt) {
	    printeftsig(receipt.merchantReceipt);
};
var transactionCompleteCallbackImpl = function (response) {
    if (response.customerReceipt) {
	    $('#eftposModal').modal('hide');
		var purval = $( "#barcode" ).val();
	    if (!purval){
		var purval = $('.simpleCart_total').val();
		//var purval = purval.replace(".", "");
	    }else{
		var purval = $('#barcode').val();
		//var purval = purval.replace(".", "");
	    }
   addsale(response.customerReceipt, purval);
   $('#barcode').val('');

    }	

};

function doPurchase(amount) {
    iclient.initiatePurchase({
        amount: amount,
        cashout: "0",
        integratedReceipt: true,
        enableSurcharge : false
    }, {
        statusMessageCallback: statusMessageCallbackImpl,
        questionCallback: questionCallbackImpl,
        receiptCallback: receiptCallbackImpl,
        transactionCompleteCallback: transactionCompleteCallbackImpl
    });
}

function doRefund(amount) {
    iclient.initiateRefund({
        amount: amount,
        integratedReceipt: true
    }, {
        statusMessageCallback: statusMessageCallbackImpl,
        questionCallback: questionCallbackImpl,
        receiptCallback: receiptCallbackImpl,
        transactionCompleteCallback: transactionCompleteCallbackImpl
    });
}

function doCancel() {

iclient.cancelCurrentTransaction();

}

function formatReceipt(text) {
    return "<pre>" + text + "</pre>";
}

function formatResult(response) {
    var result = "<div>Result: " + response.result + "</div>";
    if (response.cardType) {
        result += "<div>Card type: " + response.cardType + "</div>";
    }
    if (response.transactionReference) {
        result += "<div>Trans ref: " + response.transactionReference + "</div>";
    }
    if (response.authorisationCode) {
        result += "<div>Auth code: " + response.authorisationCode + "</div>";
    }
    if (response.issuerActionCode) {
        result += "<div>Action code: " + response.issuerActionCode + "</div>";
    }
    return result;
}

function doPairing() {
    var mid = $("#mid").val();
    var tid = $("#tid").val();
    iclient.pairTerminal(mid, tid, function(response) {
        if ("success" == response.status) {
            console.log("Pairing success: " + JSON.stringify(response));
            $("#tyropairmessages").text("Success: " + response.message);
        } else if ("failure" == response.status) {
            console.log("Pairing failure: " + JSON.stringify(response));
            $("#tyropairmessages").text("Failure: " + response.message);
        } else {
            $("#tyropairmessages").text(response.message);
        }
    });
}
//]]> 
