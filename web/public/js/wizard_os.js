// Devices that match this will go straight to "unsupported".
function isKnownDeviceIssue()    { return false; }

// OperatingSystems:  A device will match at most 1 of these.  (ie Android is Android, not Android & Linux)
function isWindows()             { return isRawWinDesktop() && isWindowsXbox() == false && isWindowsPhone() == false && isWindowsRt() == false && isWindowsCe() == false; }
function isWindowsRt()           { return isRawWinDesktop() && isWindowsPhone() == false && isWindowsXbox() == false && (navigator.appVersion.toLowerCase().indexOf("arm") >= 0); }
function isWindowsCe()           { return isRawWinDesktop() && isWindowsPhone() == false && isWindowsXbox() == false && (navigator.userAgent.toLowerCase().indexOf("windows ce") >= 0); }
function isWindowsXbox()         { return isRawWinDesktop() && isWindowsPhone() == false && (navigator.userAgent.toLowerCase().indexOf("xbox") >= 0); }
function isWindowsPhone()        { return (navigator.appVersion.indexOf("Windows Phone") >= 0); }
function isIos()                 { return isIpad() || isIphone();  }
function isMac()                 { return isIos() == false && isAmazonSilk() == false && (navigator.userAgent.toLowerCase().indexOf("mac") > 0 ) || (navigator.platform.toLowerCase() == "macintel"); }
function isBlackberry()          { return (navigator.userAgent.toLowerCase().indexOf('blackberry') >= 0) || (navigator.userAgent.toLowerCase().indexOf('bb10') >= 0) || (navigator.userAgent.toLowerCase().indexOf('playbook') >= 0); }
function isKindleNonFire()       { return isAndroid() == false && (navigator.userAgent.toLowerCase().indexOf('kindle') >= 0) }
function isLinux()               { return isAndroid() == false && isChromeOs() == false && isAmazonSilk() == false && isRawLinux(); }
function isAndroid()             { return ((isRawLinux() || isRawPlatformBlank) && isAmazonSilk()) || (navigator.userAgent.toLowerCase().indexOf("android") >= 0); }
function isChromeOs()            { return isRawLinux() && (navigator.userAgent.toLowerCase().indexOf("cros") >= 0); }

// Browsers
function isFirefox()             { return PluginDetect.browser.isGecko || (navigator.userAgent.toLowerCase().match(".*firefox.*") != null); }
function isIe()                  { return PluginDetect.browser.isIE; }
function isChrome()              { return PluginDetect.browser.isChrome; }
function isSafari()              { return PluginDetect.browser.isSafari; }
function isAppleCnaLoginWindow()
{
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("mozilla") >= 0 && ua.indexOf("applewebkit") >= 0 && ua.indexOf("mobile/") >= 0 && ua.indexOf("safari") < 0;
}
// Mac OS X Convenience Methods
function isMacLion()             { return isMacLionOrGreater(); }
function isMacLionOrGreater()    { return isMac2(); }
function isMac1()                { return isMac() && innerDoRegexTest(".*macfalse.*(10.5|10_5|10.6|10_6).*", navigator.userAgent.toLowerCase()); }	// Make this one always return false, since these versions are deprecated.
function isMac2()                { return isMac() && innerDoRegexTest(".*mac.*(10.7|10_7|10.8|10_8|10.9|10_9|10.10|10_10|10.11|10_11|10.12|10_12|10.13|10_13|10.14|10_14).*", navigator.userAgent.toLowerCase()); }
function isMacLessThanMaverick() { return isMac() && (isMac1() || innerDoRegexTest(".*mac.*(10.7|10_7|10.8|10_8|10.9|10_9).*", navigator.userAgent.toLowerCase())); }

// Other characteristics
function isIpad()                { return (navigator.userAgent.toLowerCase().indexOf('ipad') >= 0); }
function isIphone()              { return (navigator.userAgent.toLowerCase().indexOf('iphone') >= 0); }
function isAmazonSilk()          { return (navigator.userAgent.toLowerCase().indexOf('silk') >= 0); }
function supportsActiveX()       { return "ActiveXObject" in window; }
 
// Internal convenience methods.  Should not be used externally.
function isRawPlatformBlank()    { return (navigator.platform == ""); }
function isRawLinux()            { return (navigator.platform.toLowerCase().indexOf("linux") >= 0); }
function isRawWinDesktop()       { return (navigator.platform.toLowerCase() == "win32") || (navigator.platform.toLowerCase() == "win64"); }
function innerDoRegexTest(p, v)  { return v.match(new RegExp(p))? true: false; }

function isLinuxX64()            { return (navigator.userAgent.indexOf("x86_64") >= 0); }

function isAndroid10OrGreater()  { return isAndroid10(); }
function isAndroid9OrGreater()   { return isAndroid9() || isAndroid10OrGreater(); }
function isAndroid8OrGreater()   { return isAndroid8() || isAndroid9OrGreater(); }
function isAndroid7OrGreater()   { return isAndroid7() || isAndroid8OrGreater(); }
function isAndroid6OrGreater()   { return isAndroid6() || isAndroid7OrGreater(); }
function isAndroid5OrGreater()   { return isAndroid5() || isAndroid6OrGreater(); }
function isAndroid4OrGreater()   { return isAndroid4() || isAndroid5OrGreater(); }
function isAndroid3OrGreater()   { return isAndroid3() || isAndroid4OrGreater(); }

function isAndroid10()           { return isAndroid() && (navigator.userAgent.indexOf("Android 10") >= 0); }
function isAndroid9()            { return isAndroid() && (navigator.userAgent.indexOf("Android 9") >= 0); }
function isAndroid8()            { return isAndroid() && (navigator.userAgent.indexOf("Android 8") >= 0); }
function isAndroid7()            { return isAndroid() && (navigator.userAgent.indexOf("Android 7") >= 0); }
function isAndroid6()            { return isAndroid() && (navigator.userAgent.indexOf("Android 6") >= 0); }
function isAndroid5()            { return isAndroid() && (navigator.userAgent.indexOf("Android 5") >= 0); }
function isAndroid4()            { return isAndroid() && (navigator.userAgent.indexOf("Android 4") >= 0); }
function isAndroid3()            { return isAndroid() && (navigator.userAgent.indexOf("Android 3") >= 0); }
function isAndroid2()            { return isAndroid() && (navigator.userAgent.indexOf("Android 2") >= 0); }

function isAndroidAndHs2r1Capable()
{
    // It must be Android 6.0 running on Nexus 5X or greater.  (This will need updated over time.)
    return isAndroid() && isAndroid6OrGreater() && isNexus5xOrGreater();
}

function isNexus5xOrGreater()
{
    if (isAndroid() == false) {
        return false;
    } else if (isAndroid6OrGreater() == false) {
        return false;
    } else {
        var fragments = navigator.userAgent.toLowerCase().match('nexus .* build\/');
        if (fragments && fragments.length > 0) {
            var nexusVersion = fragments[0].substring(6, fragments[0].length - 7);  // 5, 5X, 6, 6P
            var nexusVersionNumber = parseInt(nexusVersion);   // 5, 6 (no X or P)

            if (nexusVersionNumber <= 4) {
                // 4 & older do not support it.
                return false;
            } else if (nexusVersionNumber >= 6) {
                // 6 & greater supports it.
                return true;
            } else {
                // We know it is either 5 or 5X.
                return nexusVersion != "5";
            }
        } else {
            // The user agent doesn't contain the expected information.
            return false;
        }
    }
}

