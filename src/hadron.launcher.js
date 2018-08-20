/*jshint esversion: 6 */

/*
 These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
 Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/


const Config = {
  also_known_as                  : `${Configalso_known_as}`,
  all_your_bases_are_belong_to_us: `${Configall_your_bases_are_belong_to_us}`,
  mtone_base_uri                 : `${Configmtone_base_uri}`,
  author_tool_domain             : `${Configauthor_tool_domain}`,
  api_key                        : `${Configapi_key}`
};


// Load the storage facade
import {HadronStorage} from './hadron.storage.js';

import './css/launcher.css';

// Bare style, bare interactions.  Click to grow.
// Create iframe
// Pass data from span to child frame
// Avoid jquery and external CSS.

class HadronLauncher {
  constructor(self, target, options) { // class constructor
    options = typeof(options) !== "undefined" ? options : {};

    this.chatBubbleSVG = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 20h-3v4l-5.333-4h-7.667v-4h2v2h6.333l2.667 2v-2h3v-8.001h-2v-2h4v12.001zm-6-6h-9.667l-5.333 4v-4h-3v-14.001h18v14.001zm-9-4.084h-5v1.084h5v-1.084zm5-2.916h-10v1h10v-1zm0-3h-10v1h10v-1z"/></svg>';
    this.chatWindowURI = Config.all_your_bases_are_belong_to_us + 'hadron.php';

    this.target = target;
    this.hadronButton = jQuery(target).first();
    this.chrome = false;
    this.startFullscreen = false;
    this.fullyLoaded = false;
    this.iframeCreated = false;
    this.isSecure = false;
    this.hadronStorage       = new HadronStorage("hadronStorage");

    this.botAutoPages        = this.getControlData("bot-auto-open-pages", "");
    this.sizeClass           = this.getControlData("bot-size-class",   "standard");
    this.toggleClass         = this.getControlData("bot-toggle-class", "botanic-green");
    this.toggleIcon          = this.getControlData("bot-toggle-icon",  "chat_bubble_outline");
    this.needsMetaTag        = this.getControlData("bot-add-metatag",  true, "bool");
    this.launcherExternalCSS = this.getControlData("bot-launcher-external-css", "");
    this.togglePulses        = this.getControlData("bot-toggle-pulses", true, "bool");
    this.botAutoOpens        = this.getControlData("bot-auto-opens", false, "bool");
    this.botRemembersState   = this.getControlData("bot-remembers-state", true, "bool");

    //console.log("this.botAutoPages: " + this.botAutoPages);
    //console.log("this:");
    //console.log(this);

    this.getStylesheet();
    this.checkForHTTPS();
    this.addMetaTag();

    this.showChatToggle();
  }

  // Sets a flag if the parent site is running HTTPS
  checkForHTTPS() {
    var topWindow = window.top;

    if (topWindow.location.protocol !== 'https:') {
      this.isSecure = false;
    } else {
      this.isSecure = true;
    }
  }


  // Add this meta tag to make browsers happy, may need to toggle based on mobile devices?
  addMetaTag() {
    if (this.needsMetaTag == true) {
      var meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no';

      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }

  // Reads data elements from a control, applies a format and tests.
  getControlData(field, defaultValue = false, dataType = "string") {
    var foundData = this.hadronButton.data(field);

    //console.log("gcd: " + field + " " + foundData);

    if (this.isUndefined(foundData)) {
      foundData = defaultValue;
    }

    if (dataType == "bool") {
      foundData = this.checkBoolean(foundData);
    }

    return foundData;
  }

  // Map text, etc to true false response.
  checkBoolean(boolValue) {
    if(typeof(boolValue) === "boolean"){
      return boolValue;
    }

    if (boolValue) {
      var str = boolValue.toLowerCase().trim();
      if(str === "true" || str === "yes" || str === "1"){
        return true;
      }
    } return false;
  }

  // Test for undefined and return true/false
  isUndefined(value) {
    if (value == "undefined") {
      return true;
    }

    if (typeof(value) == "undefined") {
      return true;
    }

    return false;
  }

  // This shows the toggle button.
  showChatToggle() {
    if (this.hadronButton) {
      var pulse = "";

      if (this.togglePulses == true) {
        pulse = " pulse ";
      }

      this.hadronButton.hide();
      this.hadronButton.after('<a id="hadron-toggle-1" class="btn-floating btn-large ' + pulse + this.toggleClass + ' hadron-toggle">' + this.chatBubbleSVG + '</a>');

      jQuery("#hadron-toggle-1").click((el) => {
        if (this.fullyLoaded == false) {
          this.regLookUp(() => {
            if (this.botRemembersState) {
              this.setOpenState(true);
            }
            this.openChatWindow();
          });
        } else {
          jQuery("#hadron-toggle-1").hide();

          if (this.chrome != false) {
            this.chrome.hide();
          }
        }
      });
    }

    var autoState = false;
    if (this.botRemembersState) {
      autoState = this.getOpenState();
    }

    var autoOpenPageFound = this.checkAutoOpenPages();

    //console.log('fs:' + this.startFullscreen);
    //console.log('au:' + this.botAutoOpens);
    //console.log('as:' + autoState);
    //console.log('apf:' + autoOpenPageFound);


    if (this.startFullscreen == true || this.botAutoOpens == true || autoState == true || autoOpenPageFound == true) {
      this.openChatWindow();
    }
  }

  checkAutoOpenPages() {
    //console.log("ap:" + this.botAutoPages);

    if (this.botAutoPages == "") {
      return false;
    }

    var found = false;
    var pageList = this.botAutoPages.split(',');
    var currentPage = location.pathname;

    //console.log("pl: " + pageList);
    //console.log("currentPage: " + currentPage);

    for (var i = 0; i < pageList.length; i++) {
      var thisPage = pageList[i];

      //console.log("thisPage: " + thisPage);

      if (currentPage.includes(thisPage)) {
        //console.log("FOUND!");
        found = true;
        break;
      }
    }

    return found;
  }

  // Opens the window. Can be because of click, open in fullscreen or auto open.
  openChatWindow() {
    jQuery("#hadron-toggle-1").hide();
    this.initializeChatWindow();
  }

  // Last known state
  getOpenState() {
    var result = this.hadronStorage.getItem('hadronOpenState');
    if (this.isUndefined(result) == true) {
      result = false;
    }

    result = this.checkBoolean(result);

    //console.log(result + ' <= getOpenState()');

    return result;
  }

  // Sets the state
  setOpenState(value) {
    this.hadronStorage.setItem('hadronOpenState', value);

    //console.log('setOpenState(' + value + ')');
  }

  // Sets the state to false
  clearOpenState() {
    this.setOpenState(false);
  }

  // Open the iframe, do the magical stuff and pass data in.
  initializeChatWindow() {
    if (this.iframeCreated == true) {
      jQuery("#hadron-iframe").show();

      return;
    }

    var data = this.hadronButton.data();
    data.botIsSecure = this.isSecure;

    var params = jQuery.param( data );
    var uri = this.chatWindowURI + "?" + params;
    jQuery('<iframe>', {
       src: uri,
       id:  'hadron-iframe',
       class: 'quark_chat_' + this.sizeClass,
       frameborder: 0,
       scrolling: 'no',
       allowusermedia: true,
       allow: "microphone *; camera *; geolocation *"
     }).appendTo('body');

     this.iframeCreated = true;
  }

  regLookUp(successCallback) {
    successCallback();
    return;
  }

  // style everything
  appendCSS(file) {
    var link = $('<link>', {href: file, type: 'text/css', rel: "stylesheet", media:"screen,print"});
    $('head').append(link);
  }

  // Custom stylesheet from user.
  getStylesheet() {
    if (this.launcherExternalCSS != "") {
      if (this.launcherExternalCSS.indexOf('https://') === 0) {
        this.appendCSS(this.launcherExternalCSS);
      } else {
        this.consoleLog("Ignored user stylesheet, did not begin with https://");
      }
    }
  }
}

var inToggle;

if (window.jQuery) {
  inToggle = new HadronLauncher("inToggle", ".hadron-button");
} else {
  (function() {
      // Load the script
      var script = document.createElement("SCRIPT");
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
      script.type = 'text/javascript';
      script.onload = function() {
        inToggle = new HadronLauncher("inToggle", ".hadron-button");
      };
      document.getElementsByTagName("head")[0].appendChild(script);
  })();
}

window.onload = function() {
  function receiveMessage(e) {
    if (e.data == "MinimizeIframe") {
      if (inToggle.botRemembersState) {
        inToggle.setOpenState(false);
      }

      jQuery("#hadron-iframe").hide();
      jQuery("#hadron-toggle-1").show();
    }
  }

  window.addEventListener('message', receiveMessage);
};
