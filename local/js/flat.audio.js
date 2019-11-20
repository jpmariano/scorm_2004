jQuery(document).ready(function($) {
    console.log('hello');
	$("#jquery_jplayer_audio_1").jPlayer({
		ready: function(event) {
			$(this).jPlayer("setMedia", {
				title: "Miaow - Hidden",
				mp3: "http://localhost/~trieutran/recurrent_training/audio/crash.mp3",
				oga: "http://jplayer.org/audio/ogg/Miaow-02-Hidden.ogg"
			});
                        console.log('ready');
		},
		play: function() { // Avoid multiple jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		timeFormat: {
			padMin: false
		},
		swfPath: "js",
		supplied: "mp3,oga",
		cssSelectorAncestor: "#jp_container_audio_1",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		remainingDuration: true,
		keyEnabled: true,
		keyBindings: {
			// Disable some of the default key controls
			loop: null,
			muted: null,
			volumeUp: null,
			volumeDown: null
		},
		wmode: "window"
	});
});
