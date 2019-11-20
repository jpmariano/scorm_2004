$(function() {
    var url = window.location.pathname;
    var currentPage = url.substring(url.lastIndexOf('/')+1);
    var sessionKey1 = currentPage + ".ttlRead";
    var sessionKey2 = currentPage + ".kcDone";
    var isCompleted = sessionStorage.getItem(sessionKey2);
    var enableNext = true;
    var attempts = 0;
    var ttlQuestions = 0;
    var correct = true;
    var feedback1 = "You are correct. Select the Next arrow to continue.";
    var feedback2 = "That is incorrect. Please try again.";
    var feedback3 = $("#kc-incorrect-answer").html();
    
    if(!isCompleted){
        isCompleted = 0;
    }
    var ttlRead = sessionStorage.getItem(sessionKey1);
    
    if(!ttlRead){
        ttlRead = 0;
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
    
    var isEnforced = 0;
    
    //scan audio tag
    $(".jp-jplayer").each(function(){
        var id = $(this).attr("id"), wrapperID = $(this).attr("wrapper_id"), mp3 = $(this).attr("audio_file"), 
        title = $(this).attr("audio_title"), autoPlay = $(this).attr("auto_play"), enforced = $(this).attr("enforced");
        
        var res = wrapperID.split("-"); var ord = res[1];
        ord = parseInt(ord);
        
        if(binArr[ord - 1] == 1) {
            //console.log("order " + ord);
            var isRead = $("#required-" + ord).find(".isRead");
            //console.log(isRead);
            isRead.removeClass("glyphicon glyphicon-info-sign");
            isRead.addClass("glyphicon glyphicon-ok-sign");
        }                

        //console.log(binStr.split());
        checkNextBtn();
        
        if(enforced != undefined && enforced != 0) {
            isEnforced++;
            //$(".next-btn").addClass("disabled");
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
                        var res = wrapperID.split("-"); var ord = res[1];
                        var isRead = $("#" + wrapperID).find(".isRead");
                        
                        if(isRead.hasClass("glyphicon glyphicon-info-sign")) {
                            isRead.removeClass("glyphicon glyphicon-info-sign");
                            isRead.addClass("glyphicon glyphicon-ok-sign");

                            ttlRead = parseInt(ttlRead) + Math.pow(2, parseInt(ord) - 1);
                            //console.log(ttlRead);
                            sessionStorage.setItem(sessionKey1, ttlRead);
                        }
                        checkNextBtn();
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
    /*
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
    $(".required-reading").click(function() {
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
            sessionStorage.setItem(sessionKey1, ttlRead);
        }
        checkNextBtn();
    });
    */
    $("#kc-quiz-button").click(function(){
        attempts ++;
        
        $(".kc-quiz-question").each(function(){
            var choices = $(this).find(".kc-choices");
            
            for(var i=0; i < choices.length; i++) {
                var isSelected = $(choices[i]).hasClass("choice-selected");
                var isCorrect = (parseInt($(choices[i]).attr("correct")) == 1);
                
                if((isSelected == true && isCorrect == true) || (isSelected == false && isCorrect == false)) {
                    correct = correct && true;
                }
                else {
                    correct = correct && false;
                }   
            }
        });

        if(correct) {
            scanChoices();
            $("#kc-results").html(feedback1);
            $("#kc-results").removeClass("incorrect");
            $("#kc-results").addClass("correct");
            //$(".choice-input").addClass("input-green");
            $("#resultModal").modal('show');
            $("#kc-quiz-button").hide();
            //$(".next-btn").removeClass("disabled");
            sessionStorage.setItem(sessionKey2, 1);
            checkNextBtn();
            
        }
        else {
            correct = true;     //reset correct
            if(attempts >= 2) {
                scanChoices();
                $("#kc-results").html(feedback3);
                $("#kc-results").addClass("incorrect");
                $("#resultModal").modal('show');
                $("#kc-quiz-button").hide();
                //$(".next-btn").removeClass("disabled");
                sessionStorage.setItem(sessionKey2, 1);
                checkNextBtn();
            }
            else {
                $("#kc-results").html(feedback2);
                $("#kc-results").addClass("incorrect");
                $("#resultModal").modal('show');
                $(".kc-choice-label").removeClass("kc-select");
                $(".kc-choices").removeClass("choice-selected");
            }
        }
    });
    
    $(".kc-choices").click(function(){
        toggleChoices($(this));
    });
    
    function toggleChoices(choice) {
        var qID = choice.attr("question_id");
        var allowMulti = $("#question_" + qID).attr("allow_multiple");
        
        if(allowMulti == 1) {
            choice.toggleClass("choice-selected")
            choice.find(".kc-choice-label").toggleClass("kc-select");
        }
        else {
            //finding all choices belong to the question
            $("#question_" + qID).find(".kc-choices").removeClass("choice-selected");
            $("#question_" + qID).find(".kc-choice-label").removeClass("kc-select");
            
            choice.addClass("choice-selected")
            choice.find(".kc-choice-label").addClass("kc-select");
        }
    }
    
    function scanChoices()
    {
        $(".kc-quiz-question").each(function(){
            var choices = $(this).find(".kc-choices");
            
            for(var i=0; i < choices.length; i++) {
                var kcLabel = $(choices[i]).find(".kc-choice-label");
                if(parseInt($(choices[i]).attr("correct")) == 1) {
                    kcLabel.addClass("kc-green");
                }
                else {
                    kcLabel.addClass("kc-red");
                }
            }
        });
    }
});