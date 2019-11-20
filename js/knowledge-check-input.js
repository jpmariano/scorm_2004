$(document).ready(function() {
    var attempts = 0;
    var feedback1 = "You are correct. Select the Next arrow to continue.";
    var feedback2 = "That is incorrect. Please try again.";
    var ttlQuestions = 0;
    var questions = $(".knowledge-check ").find(".choice-input");
    
    var url = window.location.pathname;
    var currentPage = url.substring(url.lastIndexOf('/')+1);
    var sessionKey = currentPage + ".kcDone";
    var isCompleted = sessionStorage.getItem(sessionKey);
    
    if(!isCompleted){
        isCompleted = 0;
    }
    
    ttlQuestions = questions.length;
    var caStr = '';
    var cn = 0;
    questions.each(function(){
        if(cn < ttlQuestions - 1) {
            caStr = caStr + $(this).attr("correct") + ", ";
        }
        else {
            caStr = caStr + $(this).attr("correct");
        }
        cn ++;
    });
    var feedback3 = "That is not correct. The correct answer is " + caStr;
    
    //disable next button
    if(!isCompleted) {
            $(".next-btn").addClass("disabled");
    }
    
    function checkNextBtn(ttlCorrects) {
        if(attempts > 1 || ttlCorrects == ttlQuestions)
        {
            $(".next-btn").removeClass("disabled");
        }
    }
    
    $(".knowdledge-submit").click(function(){
        var ttlCorrects = 0;
        attempts ++;
        
        questions.each(function(){
            var answer = $(this).val();
            var correct = $(this).attr("correct");
            
            if(answer != undefined && correct != undefined){
                if(answer.toUpperCase() == correct.toUpperCase()) {
                    ttlCorrects ++;
                }
            }
        });
        
        if(ttlCorrects == ttlQuestions) {
            $("#kc-results").html(feedback1);
            $("#kc-results").removeClass("incorrect");
            $("#kc-results").addClass("correct");
            $(".choice-input").addClass("input-green");
            $("#resultModal").modal('show');
            $(".knowdledge-submit").hide();
            sessionStorage.setItem(sessionKey, 1);
        }
        else if(attempts > 1){
            $("#kc-results").html(feedback3);
            $(".choice-input").each(function(){
                $(this).val($(this).attr("correct"));
                $(this).addClass("input-green");
            });
            $("#resultModal").modal('show');
            $(".knowdledge-submit").hide();
            
            //set session 
            sessionStorage.setItem(sessionKey, 1);
        }
        else {
            $("#kc-results").html(feedback2);
            $("#kc-results").addClass("incorrect");
            $("#resultModal").modal('show');
        }
        
        checkNextBtn(ttlCorrects);
    });
});