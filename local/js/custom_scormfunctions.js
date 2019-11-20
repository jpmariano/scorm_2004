$(document).ready(function() {
    doStart();
    console.log('doStart() fired!');

    $(window).on('beforeunload', function(){
        doUnload(false);
        console.log('doUnload(false) fired!');
    });

    $(window).on("unload", function(e) {
        doUnload();
        console.log('doUnload() fired!');
    });
});

/*************************************/
//functions for sizing the iFrame
/*************************************/
function setIframeHeight(id, navWidth) {
    if (document.getElementById) {
        var theIframe = document.getElementById(id);
        if (theIframe) {
            var height = getWindowHeight();
            theIframe.style.height = Math.round(height) - navWidth + "px";
            theIframe.style.marginTop = Math.round(((height - navWidth) - parseInt(theIframe.style.height)) / 2) + "px";
        }
    }
}

function getWindowHeight() {
    var height = 0;
    if (window.innerHeight) {
        height = window.innerHeight - 18;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        height = document.documentElement.clientHeight;
    } else if (document.body && document.body.clientHeight) {
        height = document.body.clientHeight;
    }
    return height;
}

function SetupIFrame() {
    //set our iFrame for the content to take up the full screen except for our navigation
    var navWidth = 40;
    setIframeHeight("contentFrame", navWidth);
    //need this in a setTimeout to avoid a timing error in IE6
    window.setTimeout('window.onresize = function() { setIframeHeight("contentFrame", ' + navWidth + '); }', 1000);
}


/*************************************/
//content definition
/*************************************/
var pageArray = new Array(15);
pageArray[0] = "local/slides/slide-1.html";
pageArray[1] = "local/slides/slide-3.html";
pageArray[2] = "local/slides/slide-4.html";
pageArray[3] = "local/slides/slide-5.html";
pageArray[4] = "local/slides/slide-6.html";
pageArray[5] = "local/slides/slide-6aa.html";
pageArray[6] = "local/slides/slide-6a.html";
pageArray[7] = "local/slides/slide-7.html";
pageArray[8] = "local/slides/slide-8.html";
pageArray[9] = "local/slides/slide-9.html";
pageArray[10] = "local/slides/slide-12.html";
pageArray[11] = "local/slides/slide-11.html";
pageArray[12] = "local/slides/slide-13.html";
pageArray[13] = "local/slides/slide-15.html";
pageArray[14] = "local/slides/slide-16.html";


var page508 = new Array(2);
page508[0] = "local/slides/slide-508.html";
page508[1] = "local/slides/slide-508-end.html";

/*************************************/
//navigation functions
/*************************************/

var currentPage = null;
var startTimeStamp = null;
var processedUnload = false;
var reachedEnd = false;


function doStart() {

    //get the iFrame sized correctly and set up
    SetupIFrame();

    //record the time that the learner started the SCO so that we can report the total time
    startTimeStamp = new Date();

    //initialize communication with the LMS
    // ScormProcessInitialize();
    SCORM2004_CallInitialize();

    //it's a best practice to set the lesson status to incomplete when
    //first launching the course (if the course is not already completed)
    var completionStatus = SCORM2004_CallGetValue("cmi.completion_status");
    if (completionStatus == "not attempted") {
        SCORM2004_CallSetValue("cmi.completion_status", "incomplete");
    }

    //see if the user stored a bookmark previously (don't check for errors
    //because cmi.core.lesson_location may not be initialized
    var bookmark = SCORM2004_CallGetValue("cmi.location", false);


    //if there isn't a stored bookmark, start the user at the first page
    if ((bookmark == "") || (bookmark == null) || (bookmark == 0)) {
        currentPage = 0;
    } else {
        currentPage = parseInt(bookmark, 10);
    }

    goToPage();
}

function goToPage() {

    var theIframe = document.getElementById("contentFrame");

    theIframe.src = "../" + pageArray[currentPage];

    SCORM2004_CallSetValue("cmi.location", currentPage);

    if (currentPage == (pageArray.length - 1)) {
        reachedEnd = true;
        SCORM2004_CallSetValue("cmi.completion_status", "completed");
        SCORM2004_CommitData();
    }

}

function goTo508(){
    var theIframe = document.getElementById("contentFrame");
    theIframe.src = "../" + page508[currentPage];
    SCORM2004_CallSetValue("cmi.location", currentPage);
    if (currentPage == (page508.length - 1)) {
        reachedEnd = true;
        SCORM2004_CallSetValue("cmi.score.raw", 100);
        SCORM2004_CallSetValue("cmi.completion_status", "completed");
        SCORM2004_CommitData();
    }
}

function doUnload(pressedExit) {

    //don't call this function twice
    if (processedUnload == true) {
        return;
    }

    processedUnload = true;

    //record the session time
    var endTimeStamp = new Date();
    var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
    // var scormTime = ConvertMilliSecondsToSCORMTime(totalMilliseconds, false);
    var scormTime = ConvertMilliSecondsIntoSCORM2004Time(totalMilliseconds);

    SCORM2004_CallSetValue("cmi.session_time", scormTime);

    //if the user just closes the browser, we will default to saving 
    //their progress data. If the user presses exit, he is prompted.
    //If the user reached the end, the exit normall to submit results.
    if (pressedExit == false && reachedEnd == false) {
        SCORM2004_CallSetValue("cmi.exit", "suspend");
    }
    API.Commit("");
    SCORM2004_CallTerminate();
}

function doPrevious() {
    if (currentPage > 0) {
        currentPage--;
    }
    goToPage();
}

function doNext() {
    if (currentPage < (pageArray.length - 1)) {
        currentPage++;
    }
    goToPage();
}



function gotoPageNumber(pageNumber) {
    currentPage = pageNumber;
    goToPage();
}

function gotoPage508(pageNumber){
            currentPage = pageNumber;
        goTo508();
 }

function doExit() {

    //note use of short-circuit AND. If the user reached the end, don't prompt.
    //just exit normally and submit the results.
    if (reachedEnd == false && confirm("Would you like to save your progress to resume later?")) {
        //set exit to suspend
        SCORM2004_CallSetValue("cmi.exit", "suspend");
    } else {
        //set exit to normal
        SCORM2004_CallSetValue("cmi.exit", "");
    }

    //process the unload handler to close out the session.
    //the presense of an adl.nav.request will cause the LMS to 
    //take the content away from the user.
    doUnload(true);

}

//called from the assessmenttemplate.html page to record the results of a test
//passes in score as a percentage
function RecordTest(score) {
    alert("RecordTest()inside");
    SCORM2004_CallSetValue("cmi.score.raw", score);
    SCORM2004_CallSetValue("cmi.score.min", "0");
    SCORM2004_CallSetValue("cmi.score.max", "100");

    //if we get a test result, set the lesson status to passed/failed instead of completed
    //consider 70% to be passing
    if (score >= 70) {
        SCORM2004_CallSetValue("cmi.success_status", "passed");
        enableNextButton();
    } else {
        SCORM2004_CallSetValue("cmi.success_status", "failed");
    }
}

//SCORM requires time to be formatted in a specific way
function ConvertMilliSecondsToSCORMTime(intTotalMilliseconds, blnIncludeFraction) {

    var intHours;
    var intintMinutes;
    var intSeconds;
    var intMilliseconds;
    var intHundredths;
    var strCMITimeSpan;

    if (blnIncludeFraction == null || blnIncludeFraction == undefined) {
        blnIncludeFraction = true;
    }

    //extract time parts
    intMilliseconds = intTotalMilliseconds % 1000;

    intSeconds = ((intTotalMilliseconds - intMilliseconds) / 1000) % 60;

    intMinutes = ((intTotalMilliseconds - intMilliseconds - (intSeconds * 1000)) / 60000) % 60;

    intHours = (intTotalMilliseconds - intMilliseconds - (intSeconds * 1000) - (intMinutes * 60000)) / 3600000;

    /*
    deal with exceptional case when content used a huge amount of time and interpreted CMITimstamp 
    to allow a number of intMinutes and seconds greater than 60 i.e. 9999:99:99.99 instead of 9999:60:60:99
    note - this case is permissable under SCORM, but will be exceptionally rare
    */

    if (intHours == 10000) {
        intHours = 9999;

        intMinutes = (intTotalMilliseconds - (intHours * 3600000)) / 60000;
        if (intMinutes == 100) {
            intMinutes = 99;
        }
        intMinutes = Math.floor(intMinutes);

        intSeconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000)) / 1000;
        if (intSeconds == 100) {
            intSeconds = 99;
        }
        intSeconds = Math.floor(intSeconds);

        intMilliseconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000) - (intSeconds * 1000));
    }

    //drop the extra precision from the milliseconds
    intHundredths = Math.floor(intMilliseconds / 10);

    //put in padding 0's and concatinate to get the proper format
    strCMITimeSpan = ZeroPad(intHours, 4) + ":" + ZeroPad(intMinutes, 2) + ":" + ZeroPad(intSeconds, 2);

    if (blnIncludeFraction) {
        strCMITimeSpan += "." + intHundredths;
    }

    //check for case where total milliseconds is greater than max supported by strCMITimeSpan
    if (intHours > 9999) {
        strCMITimeSpan = "9999:99:99";

        if (blnIncludeFraction) {
            strCMITimeSpan += ".99";
        }
    }

    return strCMITimeSpan;

}

function ZeroPad(intNum, intNumDigits) {

    var strTemp;
    var intLen;
    var i;

    strTemp = new String(intNum);
    intLen = strTemp.length;

    if (intLen > intNumDigits) {
        strTemp = strTemp.substr(0, intNumDigits);
    } else {
        for (i = intLen; i < intNumDigits; i++) {
            strTemp = "0" + strTemp;
        }
    }

    return strTemp;
}

function LMS_GetObjectiveStatus(intObjId) {
    var objectiveId = intObjId.toString();
    var objectiveStatus = "cmi.objectives.";

    objectiveStatus += objectiveId;
    objectiveStatus += ".status";
    var objectiveStatusValue = LMSGetValue(objectiveStatus);

    return objectiveStatusValue;
}

function LMS_GetObjectiveScoreRaw(intObjId) {
    var objectiveId = intObjId.toString();
    var objectiveScoreRaw = "cmi.objectives.";

    objectiveScoreRaw += objectiveId;
    objectiveScoreRaw += ".score.raw";

    var objectiveScoreRawValue = LMSGetValue(objectiveScoreRaw);

    return objectiveScoreRawValue;
}