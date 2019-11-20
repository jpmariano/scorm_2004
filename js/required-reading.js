$(function() {
    var url = window.location.pathname;
    var currentPage = url.substring(url.lastIndexOf('/')+1);
    var sessionKey = currentPage + ".ttlRead";

    var ttlRead = sessionStorage.getItem(sessionKey);
    
    if(!ttlRead){
        ttlRead = 0;
    }

    var ttlRequired = $(".required-reading").length;
    //console.log("total " + ttlRequired);
    if(ttlRequired > 0) {
        $(".next-btn").addClass("disabled");
    }

    var binStr = parseInt(ttlRead, 10).toString(2);
    var binArr = binStr.split("");
    binArr = binArr.reverse();

    function checkNextBtn() {
        if(ttlRequired > 0)
        {
            if(Math.pow(2, ttlRequired) - 1 == ttlRead) {
                $(".next-btn").removeClass("disabled");
            }
        }
    }
    
    //scan thru required-reading to mark ones have been read
    // and enable next-btn if all are read.
     $(".required-reading").each(function(){
        var id = $(this).attr('id');
		//console.log(id);
        var res = id.split("-"); var ord = res[1];
        ord = parseInt(ord);
        //console.log(ord);

        if(binArr[ord - 1] == 1) {
            //console.log("order " + ord);
            var isRead = $("#required-" + ord).find(".isRead");
            //console.log(isRead);
            isRead.removeClass("glyphicon glyphicon-info-sign");
            isRead.addClass("glyphicon glyphicon-ok-sign");
        }                

        //console.log(binStr.split());
        checkNextBtn();

     });
            
    //click event handler
    $(".required-reading").click(function(){
        var id = $(this).attr('id');
        var res = id.split("-"); var ord = res[1];
        //console.log(ord);

        var isRead = $(this).find(".isRead");
		
		if(isRead.hasClass("glyphicon glyphicon-info-sign")) {
            isRead.removeClass("glyphicon glyphicon-info-sign");
            isRead.addClass("glyphicon glyphicon-ok-sign");

            ttlRead = parseInt(ttlRead) + Math.pow(2, parseInt(ord) - 1);
            //console.log(ttlRead);
            sessionStorage.setItem(sessionKey, ttlRead);
        }
        checkNextBtn();
    });
});