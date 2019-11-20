$(window).load(function() {
    //get slide number from html file name
    var slideURL = document.location.href.match(/[^\/]+$/)[0];
    var slideName = slideURL.replace('.html', '');
    var slideNum = pageNumber + 1;
    var slideNumber = "SLIDE-" + slideNum;
     //slide-   
    //$(".slide").append("<div class='slide-num'>" + slideName + "</div>");
    $(".slide").append("<div class='slide-num'>" + slideNumber + "</div>");
    if($("body").hasClass("lastPage")){
    	$(".slide").append("<button id='xclose' class='closeWindow' onclick='closeWindow();'> X </button>");
    }
});

$(document).ajaxComplete(function(event, xhr, settings) {
    switch(settings.url) {
        case '../include/footer.html':
            $(".menu-btn").unbind("click");
            $('.menu-btn').bind("click", function() {
                    //console.log('Menu clicked');
                    $('.menu').toggleClass("open");
            });
            /*
            $('.next-btn').unbind("click");
            $('.next-btn').bind("click", function() {
                //for slides with required reading sections
                if($(this).hasClass("has-required-reading") && $(this).hasClass("disabled")) {
                    var alertMsg = $("#warning_message").html();
                    alert(alertMsg);
                }
                //for slides with other required interactions
                else if($(this).hasClass("disabled")) {
                    var alertMsg = $("#warning_message").html();
                    alert(alertMsg);
                }
                if($(this).hasClass("disabled")) {
                    var alertMsg = $("#warning_message").html();
                    alert(alertMsg);
                }
                else {
                    if($(this).attr("nextPage") && $(this).attr("nextPage") != ""){
                        window.location = $(this).attr("nextPage");
                    }
                }
            });

            $('.previous-btn').unbind("click");
            $('.previous-btn').bind("click", function() {
                    if($(this).attr("prevPage") && $(this).attr("prevPage") != ""){
                            window.location = $(this).attr("prevPage");
                    }
            });
            */
            break;

        case "../include/menu.html":
            //place code to handle menu items here
            break;

        default:
            break;
    }
});

jQuery( document ).ready(function($) {
	
	    $(".next-btn").attr("id","butNext");

    	if($("body").hasClass(getActivity().name)){
    		$( ".timer" ).prepend( "<div><h3 id='time' style='margin-top:5px; margin-bottom:5px; text-align:center;'></h3></div>" );
    		startDefaultTimer();
    	}
    
    	if($("body").hasClass("required")){
    		$( "body" ).ready(function() {
			  disableNextButton(); 
			  checkCompletion();
			});
			$( ".next-btn" ).bind( "click", function() {
			  requiredReading();
			  
			});
			
    	} else if($("body").hasClass("requiredAkc")) {
    		$( "body" ).ready(function() {
			  disableNextButton(); 
			  checkCompletion();
			});
    		$( ".next-btn" ).bind( "click", function() {
			  requiredReading('akc');
			});
			
    	}
    	else if ($("body").hasClass("requiredAudio")) {
    		$( "body" ).ready(function() {
			  disableNextButton(); 
			  checkCompletion();
			});
    		$( ".next-btn" ).bind( "click", function() {
			  requiredReading('audio');
			});
			
    	}
    	else if ($("body").hasClass("requiredVideo")) {
    		$( "body" ).ready(function() {
			  disableNextButton(); 
			  checkCompletion();
			});
    		$( ".next-btn" ).bind( "click", function() {
			  requiredReading('video');
			});
    	}
    	else if ($("body").hasClass("requiredKc")) {
    		$( "body" ).ready(function() {
			  disableNextButton(); 
			  checkCompletion();
			});
			
    		$( ".next-btn" ).bind( "click", function() {
			  requiredReading('kc');
			});
    	}
    	else {
    		$( ".next-btn" ).bind( "click", function() {
			  parent.doNext();
			});
    	}
    	
         $( ".previous-btn" ).bind( "click", function() {
			  parent.doPrevious();
		 }); 
    	
    	 var slideURL = document.location.href.match(/[^\/]+$/)[0];
         var slideName = slideURL.replace('.html', '');
      
         
         if (slideName == "slide-1"){
    		//alert("True");
    		$(".next-btn").after("<div id='progress-bar' class='progress col-xs-2 pull-right'>" +
			 "<div id='current-progress' class='progress-bar  progress-bar-success progress_bar' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100'>" +
			 "</div>" +
	    	 "</div>" +
	         "<script>" +
			 "setProgressBar();" +
	         "</script>");
         } else { 
         	$(".previous-btn").after("<div id='progress-bar' class='progress col-xs-2 pull-right'>" +
			 "<div id='current-progress' class='progress-bar  progress-bar-success progress_bar' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100'>" +
			 "</div>" +
	    	 "</div>" +
	         "<script>" +
			 "setProgressBar();" +
	         "</script>");
         }  
	
});