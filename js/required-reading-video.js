$(function() {
    var url = window.location.pathname;
    var currentPage = url.substring(url.lastIndexOf('/')+1);
    var sessionKey = currentPage + ".ttlRead";
    var sessionKey2 = currentPage + ".videoCompleted";
    var isCompleted = parseInt(sessionStorage.getItem(sessionKey2));
    var ttlRead = sessionStorage.getItem(sessionKey);
    
    if(!ttlRead){
        ttlRead = 0;
    }
    
    if(!isCompleted){
        isCompleted = 0;
    }
    var ttlRequired = $(".required-reading").length;
    
    if(ttlRequired > 0 && isCompleted == 0) {
        $(".next-btn").addClass("disabled");
    }

    var binStr = parseInt(ttlRead, 10).toString(2);
    var binArr = binStr.split("");
    binArr = binArr.reverse();

    function checkNextBtn() {
        if(ttlRequired > 0)
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
        }
    }
    
    //scan thru required-reading to mark ones have been read
    // and enable next-btn if all are read.
     $(".required-reading").each(function(){
        var id = $(this).attr('id');

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
        //console.log($(this))
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
    
    var isEnforced = 0;
    
    $(".jp-jplayer").each(function(){
        var id = $(this).attr("id"), wrapperID = $(this).attr("wrapper_id"), video = $(this).attr("video_file"), 
        title = $(this).attr("video_title"), autoPlay = $(this).attr("auto_play"), poster = $(this).attr("poster")
        enforced = $(this).attr("enforced");
        
        if(enforced != undefined && enforced != 0) {
            isEnforced++;
            //$(".next-btn").addClass("disabled");
        }
        
        checkNextBtn();
        
        if(video && wrapperID)
        {
            $("#" + id).jPlayer({
                ready: function(event) {
                    var options = {
                        title: title,
                        flv:  video
                    };

                    if(poster != undefined && poster != "") {
                        options.poster = poster;
                    }
                    if(autoPlay == 1) {
                        var $this = $(this).jPlayer("setMedia", options).jPlayer("play");
                    }
                    else {
                        var $this = $(this).jPlayer("setMedia", options);
                    }
                    // Fix GUI when Full Screen button is hidden.
                    if(event.jPlayer.status.noFullWindow) {
                        var $anc = $($this.jPlayer("option", "cssSelectorAncestor"));
                        $anc.find('.jp-screen-control').hide();
                        $anc.find('.jp-bar').css({"right":"0"});
                    }

                    // Fix the responsive size for iOS and Flash.
                    var fix_iOS_flash = function() {
                        var w = $this.data("jPlayer").ancestorJq.width(),
                            h = w * 9 / 16; // Change to suit your aspect ratio. Used 16:9 HDTV ratio.
                        $this.jPlayer("option", "size", {
                            width: w + "px",
                            height: h + "px"
                        });
                    };
                    var plt = $.jPlayer.platform;
                    if(plt.ipad || plt.iphone || plt.ipod || event.jPlayer.flash.used) {
                        $(window).on("resize", function() {
                            fix_iOS_flash();
                        });
                        fix_iOS_flash();
                    }
                },
                timeFormat: {
                    padMin: false
                },
                swfPath: "../js/",
                supplied: "flv",
                cssSelectorAncestor: "#" + wrapperID,
                // See the CSS for more info on changing the size.
                size: {
                    width: "100%",
                    height: "auto",
                    cssClass: "jp-flat-video-responsive"
                },
                sizeFull: {
                    cssClass: "jp-flat-video-full"
                },
                autohide: {
                    full: false,
                    restored: false
                },
                // While playing, allow the GUI to hide
                play: function() {
                    $(this).jPlayer("option", "autohide", {
                        full: true,
                        restored: true
                    });
                    // Avoid multiple jPlayers playing together.
                    $(this).jPlayer("pauseOthers");
                },
                // When paused, show the GUI
                pause: function() {
                    $(this).jPlayer("option", "autohide", {
                        full: false,
                        restored: false
                    });
                },
                // Enable clicks on the video to toggle play/pause
                click: function(event) {
                    if(event.jPlayer.status.paused) {
                            $(this).jPlayer("play");
                    } else {
                            $(this).jPlayer("pause");
                    }
                },
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: !($.jPlayer.browser.msie && $.jPlayer.browser.version < 9), // IE8 did not like the hidden animated progress bar.
                remainingDuration: true,
                keyEnabled: true,
                keyBindings: {
                        // Disable some of the default key controls
                    loop: null,
                    muted: null,
                    volumeUp: null,
                    volumeDown: null
                },
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
                            sessionStorage.setItem(sessionKey2, 1);
                        }
                        checkNextBtn();
                    }
                    
                }
            });
        }
    });
});