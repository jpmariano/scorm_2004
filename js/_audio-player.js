jQuery(document).ready(function($) {
    var isEnforced = 0;
    
    //scan audio tag
    $(".jp-jplayer").each(function(){
        var id = $(this).attr("id"), wrapperID = $(this).attr("wrapper_id"), mp3 = $(this).attr("audio_file"), 
        title = $(this).attr("audio_title"), autoPlay = $(this).attr("auto_play"), enforced = $(this).attr("enforced");
        
        if(enforced != undefined && enforced != 0) {
            isEnforced++;
            $(".next-btn").addClass("disabled");
        }
        
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
                        //console.log("ended");
                        if(enforced) {
                            isEnforced--;
                            if(isEnforced == 0) {
                                $(".next-btn").removeClass("disabled");
                            }
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

