var title = "Cloudpath ES by Ruckus Networks";
var productName = "Cloudpath ES";
var signer = "Cloudpath Networks";
var productFriendlyName = "Network Wizard";
// NOTE:  The ES_VERSION_BUILD variable will only be populated on 3312 and greater.
var esBuildNumber = "3314";
var url = location.protocol + "//" + location.host + location.pathname;
if (url.lastIndexOf('/') >= 0) {
   url = url.substring(0, url.lastIndexOf('/') + 1);
}

function getEsBuildNumber()
{
    if (isNaN(esBuildNumber)) {
      // This is a version pre-3312 that does not populate the build number.
      esBuildNumber = 3311
    }
    return esBuildNumber
}

function isEsBuildLessThan(build)                           { return getEsBuildNumber() < build; }
function isEsBuildLessThanOrEqualTo(build)                  { return getEsBuildNumber() <= build; }
function isEsBuild(build)                                   { return getEsBuildNumber() == build; }
function isEsBuildGreaterThan(build)                        { return getEsBuildNumber() > build; }
function isEsBuildGreaterThanOrEqualTo(build)               { return getEsBuildNumber() >= build; }

function show(tableName)
{
   try {
      var v = document.getElementById(tableName);
      if (v != null) {
         v.style.display = '';
      }
   } catch (e) {
      // Ignore.
   }
}

function hide(tableName)
{
   try {
      var v = document.getElementById(tableName);
      if (v != null) {
         v.style.display = 'none';
      }
   } catch (e) {
      // Ignore.
   }
}

function getParameterValue( name )
{
   name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
   var regexS = "[\\?&]"+name+"=([^&#]*)";
   var regex = new RegExp( regexS );
   var results = regex.exec( window.location.href );
   if( results == null )
      return "";
   else
      return results[1];
}

// Used by login page (ie username prompt).
// This function handles the the username-related checks, including case, regex, and replacement regex.
// This function is called when the user tabs out of the username field.  It is indirectly called on "submit" by prepareToSubmit.
function checkUsernameField(defaultUserName, desiredSuffixString, regexReplace, userNameRegex, preCredentialCase, invalidUserError)
{
   userNameField = document.getElementById("username");
   newUserName = getCheckedUserName(userNameField.value, defaultUserName, desiredSuffixString, regexReplace, preCredentialCase);
   userNameField.value = newUserName;

   if (newUserName != defaultUserName) {
      //setCookie("username", newUserName, 1);
   }

   errorMessage = getUserNameErrorMessage(newUserName, userNameRegex, invalidUserError);
   if (errorMessage.length > 0) {
      document.getElementById("iphone-login-error").innerHTML = "<div class='iphone-login-error-outer'><div class='iphone-login-error-inner'>" + errorMessage + "</div></div>";
      return false;
   } else {
      document.getElementById("iphone-login-error").innerHTML = "";
      return true;
   }
}

function setCookie(c_name,value,exdays)
{
   var exdate=new Date();
   exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value + "; HttpOnly; secure";
}

function getCookie(c_name)
{
   var i,x,y,ARRcookies=document.cookie.split(";");
   for (i=0;i<ARRcookies.length;i++)
   {
      x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
      y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");
      if (x==c_name)
      {
         return unescape(y);
      }
   }
}


/** Shiro: Used by AUP. */
function testEula()
{
   if (checkEula() == false) {
      // If the user clicks the disabled "Start" button, make the EULA green.
      var eula = document.getElementById('cpx-eulaBox');
      if (eula != null) {
         eula.className += ' cpx-eulaBox-highlighted cpx-' + cssPageId + '-eulaBox-highlighted';
      }
   }
}

/** Shiro: Used by AUP. */
function checkEula()
{
   try {
      if (document.getElementById('eula') == null || document.getElementById('eula').checked)
      {
         var continueButton = document.getElementById('continue-button');
         var continueDiv = document.getElementById('continue-div');
         if (continueDiv != null && continueButton != null) {
            continueDiv.className = 'cpx-continue cpx-' + cssPageId + '-continue';
            continueButton.focus();
         }

         // Remove the background color from the EULA box.
         var eula = document.getElementById('cpx-eulaBox');
         if (eula != null) {
            eula.className = 'cpx-eulaBox cpx-' + cssPageId + '-eulaBox';
         }

         return true;
      } else {
         var continueButton = document.getElementById('continue-button');
         var continueDiv = document.getElementById('continue-div');
         if (continueDiv != null && continueButton != null) {
            continueDiv.className = 'cpx-continue-disabled cpx-' + cssPageId + '-continue-disabled cpx-continue cpx-' + cssPageId + '-continue ';
            continueButton.href = '#';
            document.getElementById('eula').focus();
         }
         return false;
      }
   } catch (e) {
   }
   return true;
}

/** Shiro: Used by OTP. */
function getErrorMessageForRegex(value, regex, invalidError)
{
   if (value == '') {
      return "The field must be populated.";
   }
   if (regex != '') {
      if (value.match( regex )) {
         return "";
      } else {
         return invalidError;
      }
   }
   return '';
}

/** Shiro: Used by OTP. */
function checkField(fieldId, defaultValue, regex, theCase, invalidError)
{
   return checkField2(fieldId, defaultValue, regex, theCase, invalidError, "", "");
}
function checkField2(fieldId, defaultValue, regex, theCase, invalidError, suffixes, replacementRegex)
{
   field = document.getElementById(fieldId);
   newValue = getCheckedUserName(field.value, defaultValue, suffixes, replacementRegex, theCase);
   field.value = newValue;

   errorMessage = getErrorMessageForRegex(newValue, regex, invalidError);
   if (errorMessage.length > 0) {
      document.getElementById("error").innerHTML = errorMessage;
      return false;
   } else {
      document.getElementById("error").innerHTML = "";
      return true;
   }
}

function endsWith(str, suffix)            { return str.indexOf(suffix, str.length - suffix.length) !== -1; }

function getCheckedUserName(userName, defaultUserName, suffixes, replacementRegex, userNameCase)
{
   debug = false;

   if (debug) { alert("CHECK: " + userName + " defaultUserName=" + defaultUserName + ", ReplacementRegex=" + replacementRegex + ", UserNameCase=" + userNameCase); }

   // Check that username is populated.
   if (userName.length == 0) {
      userName = defaultUserName;
   }

   // Check agains the default username.
   if (debug) { alert(" - Will check case."); }
   if (userName.length == 0) {
      // Username is blank.  Set it to default username.
      return defaultUserName;
   } else if (defaultUserName == userName) {
      // Username is the default.  Do nothing.
      return userName;
   }

   // Apply Username Case.
   if (userNameCase == 1) {
      userName = userName.toUpperCase();
   } else if (userNameCase == 2) {
      userName = userName.toLowerCase();
   }

   // Username Replacement Regex
   if (debug) { alert(" - Will check replacement regex. (" + replacementRegex + ")"); }
   if (replacementRegex.length > 0) {
      parts = splitReplacementRegex(replacementRegex);
      regex2 = new RegExp(parts[0], parts[1]);
      userName = userName.replace(regex2, parts[2]);
      if (debug) { alert("Username at end of regex replace: " + userName); }
   }

   // Apply Default Suffix.
   if (debug) { alert(" - Will check defualt suffixes."); }
   if (suffixes.length > 0) {
      suffixArray = suffixes.split(";");
      match = false;
      for (m=0; match == false && m < suffixArray.length; m++) {
         if (endsWith(userName.toUpperCase(), suffixArray[m].toUpperCase())) {
            match = true;
         }
      }
      if (match == false) {
         userName = userName + suffixArray[0];
      }
   }


   if (debug) { alert("Returning; " + userName); }
   return userName;
}

function splitReplacementRegex(replacementRegex)
{
   debug=false;
   if (replacementRegex.length > 0) {
      if (debug) { alert(" - Checking replacement regex. (" + replacementRegex + ")"); }
      workString = replacementRegex;
      if (workString.indexOf("s/") == 0) {
         workString = workString.substring(2);
      }
      if (workString.indexOf("/") == 0) {
         workString = workString.substring(1);
      }
      modifiers = "";
      if (endsWith(workString, "/i")) {
         workString = workString.substring(0, workString.length - 2);
         modifiers = "i";
      } else if (endsWith(workString, "/gi") || endsWith(workString, "/ig")) {
         workString = workString.substring(0, workString.length - 3);
         modifiers = "gi";
      } else if (endsWith(workString, "/g")) {
         workString = workString.substring(0, workString.length - 2);
         modifiers = "g";
      } else {
         modifiers = "";
      }

      if (endsWith(workString, "/") && endsWith(workString, "\\/") == false) {
         workString = workString.substring(0, workString.length - 1);
      }

      strArray = workString.split("/");

      m = 0;
      theMatchString = strArray[m++];
      while (strArray.length >= m && getEndingSlashCount(theMatchString) % 2==1) {
         theMatchString = theMatchString.substring(0, theMatchString.length -1) + "/" + strArray[m++];
      }

      theReplacementString = (strArray.length > m? strArray[m++]: "");
      while (strArray.length > m && getEndingSlashCount(theReplacementString) % 2 == 1) {
         theReplacementString = theReplacementString.substring(0, theReplacementString.length -1);
         theReplacementString += "/" + strArray[m++];
      }

      if (endsWith(theReplacementString, "\\") && getEndingSlashCount(theReplacementString) % 2==1) {
         theReplacementString = theReplacementString + "\\";
      }

      theReplacementString = theReplacementString.replace("\\\\", "\\");

      if (debug) { alert("Parts: " + theMatchString + ", " + modifiers + ", " + theReplacementString); }
      return new Array(theMatchString, modifiers, theReplacementString);
   }
   return new Array();
}

function getUserNameErrorMessage(userName, userNameRegex, invalidUserError)
{
   if (userName == '') {
      return "The user name field must be populated.";
   }
   if (userNameRegex != '') {
      if (userName.match( userNameRegex )) {
         return "";
      } else {
         return invalidUserError;
      }
   }
   return '';
}

function getEndingSlashCount(value)
{
   count = 0;
   var i = 10;
   for (i = value.length - 1; value != null && i >= 0; i=i-1) {
      if ("\\" == (value.substring(i, i+1))) {
         count ++;
      } else {
         return count;
      }
   }
   return count;
}

// Displays the "please wait" shadowbox.
function showPleaseWait()
{
   var v = document.getElementById("cpx-wait-shadow");
   if (v != null) {
      v.style.display="block";
      v.style.width = getScreenWidth() + "px";
      v.style.height = getPageHeight() + "px";
   }

   v = document.getElementById("cpx-wait");
   if (v != null) {
      v.style.top = (getScreenTop() + 150) + "px";
      v.style.left=(((getScreenWidth() > 440? getScreenWidth(): 440) - 250) / 2) + "px";
      v.style.display="block";
   }

   return true;
}

function hidePleaseWait()
{
   var v = document.getElementById("cpx-wait-shadow");
   if (v != null) {
      v.style.display="none";
   }

   v = document.getElementById("cpx-wait");
   if (v != null) {
      v.style.display="none";
   }

   return true;
}

function changeSection(id, allowCollapse, allowExpand, hideIfCollapsed)
{
   var section = document.getElementById(id);
   if (section) {
     var container = document.getElementById(id + "-container");
     var header = document.getElementById(id + "-header");
     var headerLink = document.getElementById(id + "-header-link");
     if(section.style.display=="none"){
        if (allowExpand) {
           section.style.display = "block";
           header.className = header.className.replace(" cpx-wizard-expand-cell-header-collapsed", "");
           headerLink.className = headerLink.className.replace(" cpx-wizard-expand-cell-header-link-collapsed", "");
           container.style.display = "block";
        } else if (hideIfCollapsed) {
           // Make sure this is hidden.
           container.style.display = "none";
        } else {
           // Make sure this is visible.
           container.style.display = "block";
        }
     } else {
        if (allowCollapse) {
           section.style.display = "none";
           header.className = header.className + " " + "cpx-wizard-expand-cell-header-collapsed";
           headerLink.className = headerLink.className + " " + "cpx-wizard-expand-cell-header-link-collapsed";
 
           if (hideIfCollapsed) {
               container.style.display = "none";
           }
        } else {
           // Make sure this is visible.
           container.style.display = "block";
        }
      }
   }
}

function doRegexTest(regexPattern, value)
{
   var re = new RegExp(regexPattern);
   if (value.match(re)) {
      return true;
   } else {
      return false;
   }
}

function startDownload()
{
   if (document.download_source.appstore.value == "google")
   {
      window.location = "market://details?id=net.cloudpath.xpressconnect";
   }
   else if (document.download_source.appstore.value == "direct")
   {
      window.location = "installs/Cloudpath.apk";
   }
   else if (document.download_source.appstore.value == "amazon")
   {
      window.location = "http://www.amazon.com/gp/mas/dl/android?p=net.cloudpath.xpressconnect";
   }
}

function setAdUsernameCookie(username)       { setCookie("cpx-ad-username", username, 1); }
function getAdUsernameCookie()               { return getCookie("cpx-ad-username"); }

function setContinueState(cssPageId, state)
{
   try {
      if (state)
      {
         var continueButton = document.getElementById('continue-button');
         var continueDiv = document.getElementById('continue-div');
         if (continueDiv != null && continueButton != null) {
            continueDiv.className = 'cpx-continue cpx-' + cssPageId + '-continue';
            continueButton.focus();
         }
         return true;
      } else {
         var continueButton = document.getElementById('continue-button');
         var continueDiv = document.getElementById('continue-div');
         if (continueDiv != null && continueButton != null) {
            continueDiv.className = 'cpx-continue-disabled cpx-' + cssPageId + '-continue-disabled cpx-continue cpx-' + cssPageId + '-continue ';
            continueButton.href = '#';
         }
         return false;
      }
   } catch (e) {
   }
   return true;
}

function setContinueStateWithoutFocus(cssPageId, state)
{
   try {
      if (state)
      {
         var continueButton = document.getElementById('continue-button');
         var continueDiv = document.getElementById('continue-div');
         if (continueDiv != null && continueButton != null) {
            continueDiv.className = 'cpx-continue cpx-' + cssPageId + '-continue';
            //continueButton.focus();
         }
         return true;
      } else {
         var continueButton = document.getElementById('continue-button');
         var continueDiv = document.getElementById('continue-div');
         if (continueDiv != null && continueButton != null) {
            continueDiv.className = 'cpx-continue-disabled cpx-' + cssPageId + '-continue-disabled cpx-continue cpx-' + cssPageId + '-continue ';
            continueButton.href = '#';
         }
         return false;
      }
   } catch (e) {
   }
   return true;
}



/** Shiro: Used by DataPrompt. */
function checkDataPromptField(fieldId, regex, invalidError)
{
   field = document.getElementById(fieldId);
   newValue = getCheckedUserName(field.value, '', '', '', 0);
   field.value = newValue;

   errorMessage = ''
   if (regex != '') {
      if (newValue.match( regex )) {
         errorMessage = "";
      } else {
         errorMessage = invalidError;
      }
   }

   if (errorMessage.length > 0) {
      document.getElementById("error").innerHTML = errorMessage;
      return false;
   } else {
      document.getElementById("error").innerHTML = "";
      return true;
   }
}

function isNarrowDevice()
{
   return screen.width < 768;
}

function isKnownDeviceIssue()
{
   ua = navigator.userAgent.toLowerCase();

   if (ua.match(".*android.*gtablet.*")) {
      return true;
   } else if (ua.match(".*android.*nook.*tablet.*")) {
      return true;
   } else if (ua.match(".*android.*nook.*build.*")) {
      return true;
   } else if (ua.match(".*android.*build/nook.*")) {
      return true;
   }
   return false;
}

function getRadioValue(name)
{
   var radios = document.getElementsByName(name);

   for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
         return radios[i].value;
      }
   }
   return "";
}

function getAjaxXmlHttp()
{
   var xmlhttp;
   if (window.XMLHttpRequest)
   {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
   }
   else
   {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
   return xmlhttp;
}

function startAndroidDownload()
{
  var e = document.getElementById("cpx-wait");
  e.className="cpx-appstore-popup";
  var html = "<div class='cp-dialog-wait' id='cp-dialog-wait'>" +
             "<div class='cpx-appstore-popup-close'><a onclick='hidePleaseWait(); return false;' href='#'><img src='static/images/close.png'/></a></style></div>";
  html += "";
  html += "</div>";
  e.innerHTML = html;
  showPleaseWait();
}

// Returns the usable width of the browser window.  This is only the portion visible at one time (not the scrolling part).
function getScreenWidth()
{ return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; }
// Returns the usable height of the browser window.  This is only the portion visible at one time (not the scrolling part).
function getScreenHeight()
{ return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; }
// Returns the full height of the document.  When the scrollbar is present, this is greater than screen height.
function getPageHeight()
{ return Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight ); }
// Returns the left point of the visible portion of the browser window.  Without scrollbar, this is 0.  With scrollbar, this is greater than 0.
function getScreenLeft()
{ return (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0); }
// Returns the top point of the visible portion of the browser window.  Without scrollbar, this is 0.  With scrollbar, this is greater than 0.
function getScreenTop()
{ return (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0); }


// This method is called for body.onLoad().  If there are any divs that need to be shown only on a particular browser,
// it should have a class name similar to cpn-safariOnly.  The div will begin hidden but then be displayed during
// onLoad() by this method.
function doAdjustForBrowser()
{
  if (isIe()) {
    showBrowserSpecificDivs("ie");
  } else if (isFirefox()) {
    showBrowserSpecificDivs("firefox");
  } else if (isChrome()) {
    showBrowserSpecificDivs("chrome");
  } else if (isSafari() || isAppleCnaLoginWindow() ) {
    // NOTE:  Safari should be checked last because somethings include safari info.
    showBrowserSpecificDivs("safari");
  } else {
    showBrowserSpecificDivs("other");
  }
}

function showBrowserSpecificDivs(browserName)
{
  var elements = document.getElementsByClassName("cpn-" + browserName + "Only");
  for (var i = 0; i < elements.length; i++) {
    try {
      elements[i].style.display = 'block';
    } catch (e) {
      // Ignore.
    }
  }
}

function redirectIntoWizard()
{

}

function monitorForCertificateCn(count)
{
  if (count < 10) {
    xmlhttp = getAjaxXmlHttp();
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        cn = xmlhttp.responseText;
        if (cn != null && cn.length > 0) {
          var elements = document.getElementsByName("cpn-certificateCn");
          for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = cn;
          }
        } else {
           setTimeout("monitorForCertificateCn(" + (count+1) + ")", 1000);
        }
      }
    }
    xmlhttp.open("GET", "getCn", true);
    xmlhttp.send();
  }
}

/** Shiro: Used by WorkflowAccessRequest. */
function checkAccessRequestField(fieldId, regex, invalidError)
{
    field = document.getElementById(fieldId);
    newValue = getCheckedUserName(field.value, '', '', '', 0);
    field.value = newValue;

    errorMessage = ''
    if (regex != '') {
        if (newValue.match( regex )) {
            errorMessage = "";
        } else {
            errorMessage = invalidError;
        }
    }

    if (errorMessage.length > 0) {
        document.getElementById("error").innerHTML = errorMessage;
        return false;
    } else {
        document.getElementById("error").innerHTML = "";
        return true;
    }
}

function getValueFromAjax(responseXml, elementName) {
    if (responseXml && responseXml.documentElement) {
        var results = responseXml.documentElement.getElementsByTagName(elementName);
        for (var i = 0; i < results.length; i++) {
            return results[i].innerHTML;
        }
    }
    return "";
}

function showPageWarning(message)
{
    var v = document.getElementById('cpx-header-warningTopbar');
    if (v != null) {
        v.style.display = 'block';
        v.innerHTML = message;
    }
}

function hidePageWarning()
{
    var v = document.getElementById('cpx-header-warningTopbar');
    if (v != null) {
        v.style.display = 'none';
        v.innerHTML = '';
    }
}

