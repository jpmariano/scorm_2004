jQuery(document).ready(function($) {
    var url = window.location.pathname;
    var currentPage = url.substring(url.lastIndexOf('/')+1);
    var sessionKey1 = currentPage + ".audioCompleted";
    var isCompleted = sessionStorage.getItem(sessionKey1);
    var isEnforced = 0;
    
    if(!isCompleted){
        isCompleted = 0;
    }
    
    function checkNextBtn() {
        /*if(ttlRequired > 0)
        {
            if(Math.pow(2, ttlRequired) - 1 == ttlRead) {
            	var complete = sessionStorage.getItem(sessionKey2);
            	
            	if(!complete){
                    complete = 0;
		}
				
            	if(complete > 0) {
                    $(".next-btn").removeClass("disabled");
                }
            }
        }*/
        var complete = parseInt(sessionStorage.getItem(sessionKey1));
        
        if(!complete){
            complete = 0;
	}
        
        if(complete > 0) {
            $(".next-btn").removeClass("disabled");
        }
    }
    
    //scan audio tag
    $(".jp-jplayer").each(function(){
        var id = $(this).attr("id"), wrapperID = $(this).attr("wrapper_id"), mp3 = $(this).attr("audio_file"), 
        title = $(this).attr("audio_title"), autoPlay = $(this).attr("auto_play"), enforced = $(this).attr("enforced");
        
        if(enforced != undefined && enforced != 0) {
            isEnforced++;
            $(".next-btn").addClass("disabled");
        }
        
        checkNextBtn();
        
        var loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        var audioPath = window.location.protocol + "//" + window.location.host + dir.substring(0, dir.lastIndexOf('/'));
        if(wrapperID && mp3)
        {
            if(mp3 === undefined) {
            }
            else
            {
                $options = {
                    play: function() { // Avoid multiple jPlayers playing together.
                        $(this).jPlayer("pauseOthers");
                    },
                    timeFormat: {
                        padMin: false
                    },
                    swfPath: "../js",
                    //supplied: "mp3,oga",
                    supplied: "mp3",
                    cssSelectorAncestor: "#" + wrapperID,
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    remainingDuration: true,
                    keyEnabled: true,
                    wmode: "window",
                    ended: function(event){
                        /*var res = wrapperID.split("-"); var ord = res[1];
                    var isRead = $("#" + wrapperID).find(".isRead");

                    if(isRead.hasClass("glyphicon glyphicon-info-sign")) {
                        isRead.removeClass("glyphicon glyphicon-info-sign");
                        isRead.addClass("glyphicon glyphicon-ok-sign");

                        ttlRead = parseInt(ttlRead) + Math.pow(2, parseInt(ord) - 1);
                        //console.log(ttlRead);
                        sessionStorage.setItem(sessionKey1, ttlRead);
                    }*/
                        if(enforced) {
                            isEnforced--;
                            if(isEnforced == 0) {
                                //$(".next-btn").removeClass("disabled");
                                sessionStorage.setItem(sessionKey1, 1);
                            }
                            checkNextBtn();
                        }
                    }
                };
                if(autoPlay == 1) {
                    $options.ready = function(event) {
                        $(this).jPlayer("setMedia", {
                            title: title,
                            mp3: audioPath + "/" + mp3
                        }).jPlayer("play");
                    }
                }
                else
                {
                    $options.ready = function(event) {
                        $(this).jPlayer("setMedia", {
                            title: title,
                            mp3: audioPath + "/" + mp3
                        }).jPlayer("play").jPlayer("pause");
                    }
                }
                $("#" + id).jPlayer($options);
            }
        }
    });
});

