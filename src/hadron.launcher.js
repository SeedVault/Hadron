/*jshint esversion: 6 */

/*
 These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
 Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/


const Config = {
  also_known_as                  : "",
  all_your_bases_are_belong_to_us: "",
  bbot_base_uri                  : "",
  author_tool_domain             : "",
  bbot_id                        : ""
};

import './assets/css/launcher.css';

// Load the storage facade
import {HadronStorage} from './hadron.storage.js';
import zoid from 'zoid'
import { destroyElement, toCSS } from 'belter';

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
    this.toggleClass         = this.getControlData("bot-toggle-class", "");
    this.toggleIcon          = this.getControlData("bot-toggle-icon",  "chat_bubble_outline");
    this.needsMetaTag        = this.getControlData("bot-add-metatag",  true, "bool");
    this.launcherExternalCSS = this.getControlData("bot-launcher-external-css", "");
    this.togglePulses        = this.getControlData("bot-toggle-pulses", true, "bool");
    this.botAutoOpens        = this.getControlData("bot-auto-opens", false, "bool");
    this.botRemembersState   = this.getControlData("bot-remembers-state", true, "bool");
    this.botCloseButtonAction = this.getControlData("bot-close-button-action", "minimize");

    this.getStylesheet();
    this.checkForHTTPS();
    this.addMetaTag();


    //this.initializeChatWindow();
    this.showChatToggle();
  }

  // Sets a flag if the parent site is running HTTPS
  checkForHTTPS() {
    try {
      var topWindow = window.top;

      if (topWindow.location.protocol !== 'https:') {
        this.isSecure = false;
      } else {
        this.isSecure = true;
      }
    } catch(err) {
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

      var url = new URL(document.location);  
      var searchParams = new URLSearchParams(url.search);    
      var camelField = this.toCamelCase(field)
      console.log(camelField)
      if (searchParams.has(camelField)) {      
        foundData = searchParams.get(camelField)
        console.log(foundData)
      } else {
        foundData = defaultValue;
      }
    }

    if (dataType == "bool") {
      foundData = this.checkBoolean(foundData);
    }

    return foundData;
  }
  
  toCamelCase(str) {
      return str.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
                    .replace('-', '')
                    .replace('_', '')
      );
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
      this.hadronButton.after('<a id="hadron-toggle-1" class="' + pulse + this.toggleClass + ' hadron-toggle">' + this.chatBubbleSVG + '</a>');
      
      jQuery("#hadron-toggle-1").click((el) => {console.log('launch click')
        if (this.iframeCreated == false) {
          this.regLookUp(() => {
            if (this.botRemembersState) {
              this.setOpenState(true);
            }
            this.openChatWindow();
          });
        } else {
          jQuery(".hadron-iframe").show();
          jQuery("#hadron-toggle-1").hide();

          /*if (this.chrome != false) {
            this.chrome.hide();
          }*/
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
    console.log('setOpenState(' + value + ')');
  }

  // Sets the state to false
  clearOpenState() {
    this.setOpenState(false);
  }

  // Open the iframe, do the magical stuff and pass data in.
  initializeChatWindow() {
    if (this.iframeCreated == true) {
      jQuery(".hadron-iframe").show();      
      return;
    }

    var data = this.hadronButton.data();
    data.botIsSecure = this.isSecure;

    var hadronAppUrl  
    if (process.env.NODE_ENV == 'development') {
      hadronAppUrl = 'hadron.app.html'  
    } else if (process.env.NODE_ENV == 'production') {
      hadronAppUrl = (process.env.HADRON_URL || 'https://hadron.botanic.io/') + 'hadron.app.html'
    }

    var hadronLauncherIframe = zoid.create({
    tag: 'hadron-iframe-handler', // This has to be unique per js loaded on the page
    url: hadronAppUrl,
    
    containerTemplate: ({ uid, frame, prerenderFrame, doc, props, event, dimensions : { width, height } }) => {
        const CLASS = {
          VISIBLE:   'visible',
          INVISIBLE: 'invisible'
        };
        let div = doc.createElement('div');        
        div.setAttribute('id', uid);
        
        const style = doc.createElement('style');
        if (props.cspNonce) {
            style.setAttribute('nonce', props.cspNonce);
        }
        style.appendChild(doc.createTextNode(`
            #${ uid } {              
            }
            #${ uid } > iframe {                    
                transition: opacity .2s ease-in-out;
            }
            #${ uid } > iframe.${ CLASS.INVISIBLE } {
                opacity: 0;
            }
            #${ uid } > iframe.${ CLASS.VISIBLE } {
                opacity: 1;
        }
        `));

        frame.setAttribute('class', 'hadron-iframe quark_chat_' + this.sizeClass);
        frame.setAttribute('frameborder', 0)
        frame.setAttribute('scrolling', 'no')
        frame.setAttribute('allowusermedia', true)
        frame.setAttribute('allow', 'microphone *; camera *; geolocation *; autoplay; fullscreen;')

        div.appendChild(frame);

        prerenderFrame.setAttribute('class', 'hadron-iframe quark_chat_' + this.sizeClass);
        prerenderFrame.setAttribute('frameborder', 0)
        prerenderFrame.setAttribute('scrolling', 'no')

        div.appendChild(prerenderFrame);
        div.appendChild(style);        

        prerenderFrame.classList.add(CLASS.VISIBLE);
        frame.classList.add(CLASS.INVISIBLE);
    
        event.on(zoid.EVENT.RENDERED, () => {
            prerenderFrame.classList.remove(CLASS.VISIBLE);
            prerenderFrame.classList.add(CLASS.INVISIBLE);
    
            frame.classList.remove(CLASS.INVISIBLE);
            frame.classList.add(CLASS.VISIBLE);
    
            setTimeout(() => {
                destroyElement(prerenderFrame);
            }, 1000);
        });

        event.on(zoid.EVENT.RESIZE, ({ width: newWidth, height: newHeight }) => {
            if (typeof newWidth === 'number') {
                div.style.width = toCSS(newWidth);
            }
    
            if (typeof newHeight === 'number') {
                div.style.height = toCSS(newHeight);
            }
        });

        return div;
    }})
  console.log('Generating iframe with data: ', data)

  data.minimize = () => {
    console.log('Close button action: ' + this.botCloseButtonAction)
    if (this.botRemembersState) {
      this.setOpenState(false);
    }

    if (this.botCloseButtonAction == 'minimize') {
      jQuery(".hadron-iframe").hide();
      jQuery("#hadron-toggle-1").show();
    }
    if (this.botCloseButtonAction == 'unload') {
      jQuery(".hadron-iframe").remove()
      jQuery("#hadron-container").remove()
    }
  }

  //adding parameters in url to data  
  var url = new URL(document.location);  
  var searchParams = new URLSearchParams(url.search);
  for(var pair of searchParams.entries()) {
    // check if field is already set in code snippet, dont overwrite it
    if (this.isUndefined(data[pair[0]])) {
      data[pair[0]] = pair[1]      
    }
  }
  
  hadronLauncherIframe(data).render('body')
  this.iframeCreated = true
  jQuery(".hadron-iframe").show();      


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
      if (1||this.launcherExternalCSS.indexOf('https://') === 0) {
        this.appendCSS(this.launcherExternalCSS);
      } else {
        console.log("Ignored user stylesheet, did not begin with https://");
      }
    }
  }

  toCamelCase(str) {
      return str.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
                    .replace('-', '')
                    .replace('_', '')
      );
    }

}

var inToggle
window.inToggle = inToggle = new HadronLauncher("inToggle", "#hadron-container");
