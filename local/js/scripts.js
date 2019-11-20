String.prototype.toHHMMSS = function() {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

//Not used saved for later
function registerObjScore(intObjId, intCorrectAnswers, intTotalQuestion) {
    var score = Math.round(intCorrectAnswers * 100 / intTotalQuestion);
    var strcmiObjectiveNum = intObjId.toString();

    SCORM2004_SetObjectiveStatus(strcmiObjectiveNum, score, 100, 0);

    if (score >= 70) {
        SCORM2004_SetObjectiveStatus(strcmiObjectiveNum, LESSON_STATUS_PASSED);
        enableNextButton();
        var message = "You Passed! ";
        var percentScore = score + "% ";
        document.getElementById("quizResult").innerHTML = message + percentScore;
        alert("Congratulations, Click Next to continue");
    } else {
        SCORM2004_SetObjectiveStatus(strcmiObjectiveNum, LESSON_STATUS_FAILED);
        var message = "You Failed!";
        var percentScore = score + "% ";
        document.getElementById("quizResult").innerHTML = message + percentScore;
        alert("Try Again");
    }

    SCORM2004_CommitData();
}

//custom_scormfunctions.js
var totalTasks = parent.pageArray.length;
var currentScore = parent.SCORM2004_CallGetValue("cmi.score.raw", score);
var pageNumber = parseInt(window.parent.SCORM2004_CallGetValue("cmi.location"));
var score = 0;
var arrTrack = [];

function trackThis(intTrackID, intTotalTrack) {
    completionGoal = intTotalTrack;
    arrTrack.push(intTrackID);
    arrTrack = unique(arrTrack);
    if (arrTrack.length == completionGoal) {
        enableNextButton();
    }
}

var unique = function(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x] === newArr[y]) {
                found = true;
                break;
            }
        }
        if (!found) newArr.push(origArr[x]);
    }
    return newArr;
}



function addScore() {
    var score = calPercentage();
    parent.SCORM2004_CallSetValue("cmi.score.raw", score);
    SCORM2004_CommitData();
}

function calPercentage() {
    var pageCount = pageNumber + 1;
    var percentageScore = Math.round((pageCount / totalTasks) * 100);
    return percentageScore;
}

function addPageScore() {
    var minPageScore = calPercentage();
    var lastPageNum = parent.pageArray.length - 1;

    switch (pageNumber) {
        case 0:
            if (currentScore == "") {
                addScore();
            }
            break;
        case lastPageNum:
            if (currentScore < minPageScore) {
                score = 100;
                parent.SCORM2004_CallSetValue("cmi.score.raw", score);
                SCORM2004_CommitData();
            }
            break;
        case pageNumber:
            if (currentScore < minPageScore) {
                addScore();
            }
            break;
        default:
            null
            break;
    }

}

function updateOptions(intCurrentScore) {
    var initPercent = calPercentage();
    var currentScore = Number(intCurrentScore);

    switch (currentScore) {
        case "":
            null
            break;
        case currentScore:
            var optionsArray = [];
            var addNumOptions = (currentScore / initPercent) - 1;
            var addToOptions = addNumOptions;

            for (i = -1; i < addNumOptions; i++) {
                optionsArray.push(addToOptions);
                addToOptions--;
            }
            break;
        default:
            null
            break;
    }
    disableOptions(optionsArray);
}

function disableOptions(arrOptions) {
    var disableOptions = "";

    if (arrOptions instanceof Array) {
        for (i = 0; i < arrOptions.length; i++) {
            disableOptions += "<script>document.getElementById('pageNumber_frm').options[" + arrOptions[i] + "].disabled = false;</script>";
        }
        document.write(disableOptions);
    }
}

function selectPageOption() {
    var sel = document.getElementById("pageNumber_frm");
    var selPageNumber = sel.options[sel.selectedIndex].value;

    updateOptions();
    parent.gotoPageNumber(selPageNumber - 1); //custom_scormfunctions.js
}

function recentProgress(intCurrentScore) {
    var initPercent = calPercentage();
    var currentScore = Number(intCurrentScore);
    var pageNum = currentScore / initPercent;
    var lastPageNum = totalTasks - 1;

    switch (currentScore) {
        case "":
            parent.gotoPageNumber(1 - 1);
            break;
        case 100:
            parent.gotoPageNumber(lastPageNum);
            break;
        case currentScore:
            parent.gotoPageNumber(pageNum - 1);
            break;
        default:
            parent.gotoPageNumber(1 - 1);
            break;
    }
}

function disableNextButton() {
    var butNext = document.getElementById("butNext");
    butNext.className += " disabled";
}

function enableNextButton() {
    document.getElementById("butNext").className = "nav-btn" + " next-btn" + " pull-right" + " has-required-reading";
}

function requiredReading(strAlertInfo, intCountMedia) {
    var butNext = document.getElementById("butNext");
    var result = hasClass(butNext, 'disabled');
    var alertMessage = strAlertInfo;
    var mediaCount = intCountMedia;
    if (result == 1) {
        switch (alertMessage) {
            case "audio":
                alert("You must listen to all audio files before moving on to the next slide.");
                break;
            case "video":
                alert("You must complete the video before moving on to the next slide.");
                break;
            case "kc":
                alert("You must complete the knowledge check before moving on to the next slide.");
                break;
            case "akc":
                alert("You must complete the knowledge check and listen to all audio files before moving on to the next slide.");
                break;
            default:
                alert("You must view all required content before moving on to the next slide.");
                break;
        }

    } else {
        parent.doNext();
    }
}


function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function checkObjProgress(intObjId) {
    var objId = intObjId;
    var ObjectiveStatus = SCORM2004_GetObjectiveStatus(objId);

    if (ObjectiveStatus == "passed") {
        enableNextButton();
    }
}

function goToPageNum(intPageNum, intScoreLimit) {
    var pageNum = intPageNum;
    var updatedScore = SCORM2004_GetScore();
    if (updatedScore >= intScoreLimit) {
        parent.gotoPageNumber(pageNum - 1);
    }
}

function updateMenuLinks(intCurrentScore) {
    $("#sidebar-menu li").each(function(i) {
        $(this).addClass("item-" + (i + 1));
    });
    $("#sidebar-menu li a").addClass("disabled-link");

    function enableMenus(intTotalMenus) {
        var enableMenus = "";
        var enableMenusClick = "";
        var enableMenusScripts = "";

        for (i = 0; i < intTotalMenus; intTotalMenus--) {
            var strPageNumber = intTotalMenus.toString();
            var strTargetEl = "#sidebar-menu" + " .item-" + strPageNumber + " a";
            enableMenus += "$('" + strTargetEl + "').removeClass( 'disabled-link');";

            //var Percentage = strPageNumber * intPercentage;
            var Percentage = Math.round((intTotalMenus / totalTasks) * 100);
            enableMenusClick += "$('" + strTargetEl + "').click(function(){goToPageNum(" + strPageNumber + "," + Percentage + ");});";
        }

        enableMenusScripts += "<script>";
        enableMenusScripts += "jQuery( document ).ready(function($) {";
        enableMenusScripts += enableMenus;
        enableMenusScripts += enableMenusClick;
        enableMenusScripts += "});";
        enableMenusScripts += "</" + "script>";

        return (enableMenusScripts);
    }

    var currentScore = Number(intCurrentScore);
    switch (currentScore) {
        case "":
            null
            break;
            /* case 100:
                 null
             	break; */
        case currentScore:
            var menusArray = [];
            var addNumMenu = Math.round((currentScore * totalTasks) / 100);
            var totalMenuLink = addNumMenu;
            for (i = 0; i < totalMenuLink; totalMenuLink--) {
                menusArray.push(totalMenuLink);
            }
            var totalMenus = menusArray.length;
            var enablerMenu = enableMenus(totalMenus);
            $("#sidebar-menu").after(enablerMenu);
            break;
        default:
            null
            break;
    }
}

function setProgressBar() {
    if (updatedScore == 100) {
        var intCurrentScore = 100;
    } else {
        //var unformatIntCurrentScore = completedPageNum() * calPlainPercentage();
        var unformatIntCurrentScore = updatedScore;
        var intCurrentScore = Math.round(unformatIntCurrentScore);
    }
    var CurrentScore = intCurrentScore.toString() + "%";

    document.getElementById('current-progress').style.width = CurrentScore;
    if ((intCurrentScore > 10) && (intCurrentScore < 60)) {
        document.getElementById('current-progress').innerHTML = "<span class='current-score'>" + CurrentScore + "</span>";
    } else if (intCurrentScore >= 60) {
        document.getElementById('current-progress').innerHTML = "<span class='current-score'>" + CurrentScore + " Completed" + "</span>";
    }
}

function checkCompletion() {
    var pageCount = pageNumber + 2;
    var intScore = Math.round((pageCount / totalTasks) * 100);
    if (updatedScore >= intScore) {
        enableNextButton();
        return 1;
    } else {
        return 0;
    }
}

function registerObjScoreTime(intObjId, intCorrectAnswers) {
    var strcmiObjectiveNum = intObjId.toString();
    alert(strcmiObjectiveNum);
    var score = Math.round(intCorrectAnswers);
    alert(score);
    SCORM2004_SetObjectiveStatus(strcmiObjectiveNum, score, 100, 0);
    var hr1Score = parent.SCORM2004_GetObjectiveScore(0);
    alert(hr1Score);
    alert("registering");
    SCORM2004_CommitData();
}


function LMSSetTimeValue(intObjMinNum, strMinTime, intObjSecNum, strSecTime) {
    var strLMSSetValue = '';
    var strLMSSetMinValue = '';
    var strLMSSetSecValue = '';

    if (checkElmsForTimeValue(intObjMinNum) === 0) {
        var minutes = strMinTime;
        var seconds = strSecTime;
    } else {
        //Get Minutes and Seconds from Elms
        var getLMSMin = parent.SCORM2004_GetObjectiveScore(intObjMinNum);
        var getLMSSec = parent.SCORM2004_GetObjectiveScore(intObjSecNum);
        var getCurrentMin = strMinTime;
        var getCurrentSec = strSecTime;
        //Make sure they are in number format
        var LMSMinutes = Number(getLMSMin);
        var LMSSeconds = Number(getLMSSec);
        var currentMin = Number(getCurrentMin);
        var currentSec = Number(getCurrentSec);
        //Add Elms and displayed time from slides
        LMSMinutes = LMSMinutes * 60;
        currentMin = currentMin * 60;
        var totalSeconds = LMSMinutes + LMSSeconds + currentMin + currentSec;
        //Convert Seconds format to HH:MM:SS
        totalSeconds = totalSeconds.toString();
        totalSeconds = totalSeconds.toHHMMSS();
        if (totalSeconds.indexOf(':') === -1) {
            //alert("Not Found :"); 
        } else {
            //alert('Found :'); 
            var arrTime = totalSeconds.split(':');
            var hour = (+arrTime[0]);
            var minutes = (+arrTime[1]);
            var seconds = (+arrTime[2]);
        }

    }
    //Store Minutes and Seconds to Elms
    strLMSSetValue += "<script>";
    strLMSSetMinValue += "LMSSetValue('cmi.objectives.";
    strLMSSetMinValue += intObjMinNum.toString();
    strLMSSetMinValue += ".score.raw',";
    strLMSSetMinValue += "'" + minutes + "'";
    strLMSSetMinValue += ");";
    strLMSSetValue += strLMSSetMinValue;
    strLMSSetSecValue += "LMSSetValue('cmi.objectives.";
    strLMSSetSecValue += intObjSecNum.toString();
    strLMSSetSecValue += ".score.raw',";
    strLMSSetSecValue += "'" + seconds + "'";
    strLMSSetSecValue += ");";
    strLMSSetValue += strLMSSetSecValue;
    strLMSSetValue += "</" + "script>";

    $('#time').after(strLMSSetValue);

    var getMin = parent.SCORM2004_GetObjectiveScoreSCORM2004_GetObjectiveScore(intObjMinNum);

    var getSeconds = parent.SCORM2004_GetObjectiveScoreSCORM2004_GetObjectiveScore(intObjSecNum);
}

function LMSGetTimeValue(intActNumber) {
    //Get Variables from LMS
    var intObjMinNum = getActStorage(intActNumber).minStorage;
    var intObjSecNum = getActStorage(intActNumber).secStorage;
    var getLMSMin = parent.SCORM2004_GetObjectiveScore(intObjMinNum);
    var getLMSSec = parent.SCORM2004_GetObjectiveScore(intObjSecNum);
    getLMSSec = Number(getLMSSec);
    if (getLMSSec < 10) {
        getLMSSec = '0' + getLMSSec.toString();
    } else {
        getLMSSec = getLMSSec.toString();
    }
    var time = getLMSMin + ':' + getLMSSec;
    return time;
}

function LMSGetTotalTimeValue(intTotalAct) {
    var totalSeconds = getTotalSeconds(intTotalAct);
    totalSeconds = timeConverter(totalSeconds);
    //returns MM:SS
    return totalSeconds;
}

function LMSGetTotalTimeLeft(intTotalAct, intMaxLatencyInSec) {
    var resultMessage = '';
    var totalSeconds = getTotalSeconds(intTotalAct);
    totalSeconds = intMaxLatencyInSec - totalSeconds;
    if (totalSeconds < 0) {
        totalSeconds = '0';
        resultMessage = 'You Fail!';
    } else {
        totalSeconds = timeConverter(totalSeconds);
        resultMessage = 'You Pass!';
    }

    //returns MM:SS
    return {
        //returns MM:SS
        totalSeconds: totalSeconds,
        resultMessage: resultMessage
    }
}

function getTotalSeconds(intTotalAct) {
    var totalSeconds = 0;
    for (i = 0; i < intTotalAct; i++) {
        var intActNumber = i + 1;
        //alert(intActNumber);
        var intObjMinNum = getActStorage(intActNumber).minStorage;
        var intObjSecNum = getActStorage(intActNumber).secStorage;
        var getLMSMin = parent.SCORM2004_GetObjectiveScore(intObjMinNum);
        getLMSMin = parseInt(getLMSMin, 10) * 60;
        //alert(getLMSMin);
        var getLMSSec = parent.SCORM2004_GetObjectiveScore(intObjSecNum);
        getLMSSec = parseInt(getLMSSec, 10);
        //alert(getLMSSec);
        totalSeconds += getLMSMin + getLMSSec;
    }
    //returns totalSeconds in integer
    return totalSeconds;
}

//returns string
function timeConverter(intSeconds) {
    var totalSeconds = intSeconds.toString();
    totalSeconds = totalSeconds.toHHMMSS();
    if (totalSeconds.indexOf(':') === -1) {
        //alert("Not Found :"); 
    } else {
        //alert('Found :'); 
        var arrTime = totalSeconds.split(':');
        var hour = (+arrTime[0]);
        var minutes = (+arrTime[1]);
        var seconds = (+arrTime[2]);
        seconds = Number(seconds);
        if (seconds < 10) {
            seconds = '0' + seconds.toString();
        } else {
            seconds = seconds.toString();
        }
    }

    totalSeconds = minutes + ":" + seconds;
    return totalSeconds;
}

function getActStorage(intActivityNum) {
    var minStorage = '';
    var secStorage = '';
    switch (intActivityNum) {
        case 1:
            minStorage = 0;
            secStorage = 1;
            break;
        case 2:
            minStorage = 2;
            secStorage = 3;
            break;
        case 3:
            minStorage = 4;
            secStorage = 5;
            break;
        case 4:
            minStorage = 6;
            secStorage = 7;
            break;
        case 5:
            minStorage = 8;
            secStorage = 9;
            break;
        case 6:
            minStorage = 10;
            secStorage = 11;
            break;
        case 7:
            minStorage = 12;
            secStorage = 13;
            break;
        case 8:
            minStorage = 14;
            secStorage = 15;
            break;
        case 9:
            minStorage = 16;
            secStorage = 17;
            break;
        case 10:
            minStorage = 18;
            secStorage = 19;
            break;
        default:
            minStorage = 0;
            secStorage = 1;
            break;
    }

    return {
        minStorage: minStorage,
        secStorage: secStorage
    }
}

function getActivity() {
    var bodyClass = $("body").attr('class');
    if (bodyClass !== undefined) {
        if (bodyClass.indexOf(' ') === -1) {
            var activityClass = bodyClass;

        } else {
            bodyClass = bodyClass.split(' ');
            activityClass = bodyClass[0];
            removeClass = bodyClass[1];
        }
    }
    if (activityClass !== undefined) {
        if (activityClass.indexOf('-') === -1) { //alert('not found'); 
        } else {
            activityClass = activityClass.split('-');
            //activity - class name
            var name = activityClass[0];
            var actNumber = activityClass[1];
            name = name + '-' + actNumber;
            actNumber = Number(actNumber);
        }
    }

    var minStorage = getActStorage(actNumber).minStorage;
    var secStorage = getActStorage(actNumber).secStorage;

    return {
        name: name,
        minStorage: minStorage,
        secStorage: secStorage
    }
}

function getTime() {
    var strTime = $("#time").text();
    if (strTime.indexOf(' ') === -1) { //alert("nope!"); 
    } else { //alert('Found it'); 
        var arrStrTime = strTime.split(' ');
        arrStrTime = arrStrTime[0];
        arrStrTimeRemove = arrStrTime[1];
        if (strTime.indexOf(':') === -1) {
            //alert("nope!"); 
            var minutes = '0';
            var seconds = arrStrTime;
        } else {
            //alert('Found it'); 
            var arrTime = arrStrTime.split(':');
            var minutes = (+arrTime[0]);
            //alert(minutes);
            var seconds = (+arrTime[1]);
            //alert(seconds);
        }

    }
    return {
        minutes: minutes,
        seconds: seconds
    }
}

function stopTimer() {
    $('#time').timer('pause');
}

function resumeTimer() {
    $('#time').timer('resume');
}

function checkElmsForTimeValue(intObjNum) {
    var ObjNum = parent.SCORM2004_GetObjectiveScore(intObjNum);
    if ((ObjNum == "") || (ObjNum == null)) {
        return 0;
    } else {
        return 1;
    }
}

function startDefaultTimer() {
    var completion = checkCompletion();
    if (completion === 0) {
        $('#time').timer({
            duration: '30s',
            //format: '%M:%S',
            callback: function() {
                //alert("Time's up!");
                stopTimer();
            }
        });
    }
}

function storeTimeValues(intActNumMin, intActNumSec) {
    if ($("body").hasClass(getActivity().name)) {
        var completion = checkCompletion();
        if (completion === 0) {
            stopTimer();
            LMSSetTimeValue(intActNumMin, getTime().minutes, intActNumSec, getTime().seconds);
        }
    }
    SCORM2004_CommitData();
}

function storeDefaultTimeValues(intActNumMin, intActNumSec) {
    if ($("body").hasClass(getActivity().name)) {
        var completion = checkCompletion();
        if (completion === 0) {
            stopTimer();
            LMSSetTimeValue(intActNumMin, '0', intActNumSec, '30');
        }
    }
    SCORM2004_CommitData();
}

function closeWindow() {
    top.close();
}

//Add a Page score
addPageScore();
var updatedScore = SCORM2004_GetScore();