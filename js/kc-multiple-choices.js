$(document).ready(function() {
    var attempts = 0;
    var feedback1 = "You are correct. Select the Next arrow to continue.";
    var feedback2 = "That is incorrect. Please try again.";
    var feedback3 = $("#kc-incorrect-answer").html();
    var ttlQuestions = 0;
    var correct = true;
    
    var url = window.location.pathname;
    var currentPage = url.substring(url.lastIndexOf('/')+1);
    var sessionKey = currentPage + ".kcDone";
    var isCompleted = sessionStorage.getItem(sessionKey);
    
    if(!isCompleted){
        isCompleted = 0;
    }
    
    //$(".next-btn").prop("disabled", true);
    if(!isCompleted) {
        $(".next-btn").addClass("disabled");
    }
    
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
            //$(".next-btn").prop("disabled", false);
            $(".next-btn").removeClass("disabled");
            sessionStorage.setItem(sessionKey, 1);
            
        }
        else {
            correct = true;     //reset correct
            if(attempts >= 2) {
                scanChoices();
                $("#kc-results").html(feedback3);
                $("#kc-results").addClass("incorrect");
                $("#resultModal").modal('show');
                $("#kc-quiz-button").hide();
                //$(".next-btn").prop("disabled", false);
                $(".next-btn").removeClass("disabled");
                sessionStorage.setItem(sessionKey, 1);
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
