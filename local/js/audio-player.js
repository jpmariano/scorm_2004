jQuery(document).ready(function($) {
    //get folder path
    //scan audio tag
    $(".jp-jplayer").each(function(){
        var id = $(this).attr("id"), wrapperID = $(this).attr("wrapper_id"), mp3 = $(this).attr("audio_file"), title = $(this).attr("audio_title"), autoPlay = $(this).attr("auto_play");
        var loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        var audioPath = window.location.protocol + "//" + window.location.host + dir.substring(0, dir.lastIndexOf('/'));
        if(wrapperID && mp3)
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
		wmode: "window"
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
                    })
		}
            }
            $("#" + id).jPlayer($options);
        }
    });
});

