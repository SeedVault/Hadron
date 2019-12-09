/*jshint esversion: 6 */

/*
 These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
 Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

import Artyom from 'artyom.js';
import * as Modernizr from 'modernizr'
import zoid from 'zoid'

import './assets/css/input.css';
import './assets/css/reply.css';
import './assets/css/says.css';
import './assets/css/setup.css';
import './assets/css/sprites.css';
import './assets/css/typing.css';

import './assets/css/jquery.toast.css';

// Load the storage facade
import {HadronStorage} from './hadron.storage.js';



const Config = {
  also_known_as                  : "",
  all_your_bases_are_belong_to_us: "",
  bbot_base_uri                  : "",
  author_tool_domain             : "",
  bbotId                         : ""
};


window.inAvatar = false;

// Start up some global handler for errors to try to make hadron deal with odd errors.
window.addEventListener('error', function (e) {
  var error = e.error;
  console.log(error);
});

// The core class of Hadron
class Hadron {
  constructor(self, target, options) {
      options = typeof(options) !== "undefined" ? options : {};

  		this.name = self;

      this.hadronButton = jQuery(target);

      this.hasWebGL              = false;
      this.hasWebGLExtensions    = false;
      this.hasSpeechSynthesis    = false;
      this.hasSpeechRecognition  = false;
      this.hasBatteryAPI         = false;
      this.hasLowBattery         = false;
      this.hasLowBandwidth       = false;

      this.hadronStorage         = new HadronStorage("hadronStorage");

      //  These are internal vars
      this.tokenChecked = false;
      this.botHasSpoken = false;  // This is set to true if the bot is meant to talk first and HAS responded.
      this.token = false;
      this.soundObject = false;
      this.audioUnlocked = false;
      this.replyCount = 0;
      this.relative_path = Config.all_your_bases_are_belong_to_us;
      this.iceBreaker = false;  // this variable holds answer to whether this is the initative bot interaction or not
      this.quarkQueue = false;
      this._convo = false;
      this.standingAnswer = "ice";
      this.prereqsLoaded = false;
      this.fullyLoaded = false;
      this.stopListeningCommand = "stop listening";
      this.userDictation = false;
      this.ttsURIToCall = null;

      //jQuery controls AND this.hadronButton. These may act oddly because of the wrapping.
      this.container = false;
      this.quarkWrap = false;
      this.quarkTyping = false;
      this.inputText = false;
      this.quark = false;
      this.quarkContent = false;
      this.chrome = false;
      this.conversationArea = false;
      this.collapseButton = false;
      this.isMobile = false;
      this.disableTray = false;
      this.recoObject = false;
      this.returnToReco = false;
      this.suppressedCommand = "";
      this.hideButtonsWhenClicked = true;
      this.isDebug = false;
      this.mediaViewEnabled = false;
      this.mediaOverlay = false;
      this.mediaOverlayContent = false;
      this.mediaOverlayResponse = false;
      this.mediaViewPreservedState = false;
      this.doNotTrack = false;
      this.orderQuarksRunning = false;

      this.firstVolleyPause = 1000; // Wait one second after the first volley, just in case.

      this.doNotTrackText = "I see you have <b>Do Not Track</b> enabled.  This chat respects your request but we can't vouch for the site it is on.";

      // Controlled by data parameters. Double check readme names, defaults, etc.
      this.animationTime      = this.getControlData("bot-animation-speed", 10); // 0, 150 how long it takes to animate chat quarks, also set in CSS
      this.delayBetweenBubbles= this.getControlData("bot-bubble-delay", 10); //100, 250
      this.typeSpeed          = this.getControlData("bot-type-speed", 5); // 1, 10 delay per character, to simulate the machine "typing"
      this.botAMAText         = this.getControlData("bot-placeholder", "Ask me anything...");
      this.botWelcomeText     = this.getControlData("bot-welcome", "Say Hello or Hi to start chatting");      
      this.chromeless         = this.getControlData("bot-without-chrome", false, "bool");
      this.botAutoOpens       = this.getControlData("bot-auto-opens", false, "bool");
      this.BBotBaseUrl        = this.getControlData("bot-bbot-uri", Config.bbot_base_uri);
      this.botUserData        = this.getControlData("bot-user-data-json", "");

      this.botsFirstMessage   = this.getControlData("bot-first-message", "");
      this.botsFirstMessageTrigger = this.getControlData("bot-first-message-trigger", "hello");
      this.botTalksFirst      = this.getControlData("bot-talks-first", false, "bool");
      
      this.botResetOnLoad     = this.getControlData("bot-reset-on-load", false, "bool");
      
      this.ttsVisible         = this.getControlData("bot-tts-visible", true, "bool");
      this.ttsEnabled         = this.getControlData("bot-tts-enabled", false, "bool");      
      this.useLocalTTS        = this.getControlData("bot-local-tts", false, "bool");
      this.ttsVoiceId         = this.getControlData("bot-tts-voice-id", 0)
      this.ttsLocale          = this.getControlData("bot-tts-locale", "en_US")
      this.ttsTimeScale       = this.getControlData("bot-tts-timescale", 100)
      
      this.recoVisible        = this.getControlData("bot-voice-recognition-visible", true, "bool");
      this.recoEnabled        = this.getControlData("bot-voice-recognition-enabled", false, "bool");
      this.recoContinuous     = this.getControlData("bot-voice-recognition-continuous", false, "bool");
      this.stopListeningCommand     = this.getControlData("bot-voice-recognition-stoplistening-command", "");      

      this.use3DAvatar        = this.getControlData("bot-uses-3d-avatar", false, "bool");
      this.use3DTextPanel     = this.getControlData("bot-uses-3d-text-panel", true, "bool");
      this.use3DGUIConfig     = this.getControlData("bot-uses-3d-gui-config", false, "bool");
      this.use3DAvatarOnload  = this.getControlData("bot-uses-3d-avatar-onload", false, "bool");
      this.use3DAvatarCamPosX  = this.getControlData("bot-uses-3d-avatar-cam-pos-x", null, "float");            
      this.use3DAvatarCamPosY  = this.getControlData("bot-uses-3d-avatar-cam-pos-y", null, "float");
      this.use3DAvatarCamPosZ  = this.getControlData("bot-uses-3d-avatar-cam-pos-z", null, "float");
      this.use3DAvatarCamTargetPosX  = this.getControlData("bot-uses-3d-avatar-cam-target-pos-x", null, "float");
      this.use3DAvatarCamTargetPosY  = this.getControlData("bot-uses-3d-avatar-cam-target-pos-y", null, "float");
      this.use3DAvatarCamTargetPosZ  = this.getControlData("bot-uses-3d-avatar-cam-target-pos-z", null, "float");

      this.hideInput          = this.getControlData("bot-hide-input", false, "bool");
      this.trackAnonymousUserId = this.getControlData("bot-track-anonymous-user-id", false, "bool");
      this.userId             = this.getControlData("bot-userid", this.getAnonymousUserId(this.trackAnonymousUserId));    
      this.botId              = this.getControlData("bot-id", Config.botId);
      this.pubId              = this.getControlData("bot-publisher-id", "")
      this.pubToken           = this.getControlData("bot-publisher-token", "")
      this.widerBy            = this.getControlData("bot-wider-by", 32); // add a little extra width to quarks to make sure they don't break
      this.sidePadding        = this.getControlData("bot-side-padding", 6); // padding on both sides of chat quarks
      this.recallInteractions = this.getControlData("bot-recall-interactions", 0); // number of interactions to be remembered and brought back upon restart
      this.buttonClass        = this.getControlData("bot-button-class", "botanic-button");
      this.botSaysClass       = this.getControlData("bot-button-class", "botanic-green");      
      this.botReplyClass      = this.getControlData("bot-reply-class", "botanic-silver");
      this.showDebug          = this.getControlData("bot-show-debug", false, "bool");
      this.useFlowText        = this.getControlData("bot-use-flow-text", false, "bool");
      this.botIcon            = this.getControlData("bot-icon", ""); // this.relative_path + "css/images/hadron-48.png");
      this.showSentiment      = this.getControlData("bot-show-sentiment", false, "bool");
      this.isSecure           = this.getControlData("bot-is-secure", false, "bool");

      this.hijackRefresh      = this.getControlData("bot-refresh-uri", "");
      this.showRefresh        = this.getControlData("bot-show-refresh", false, "bool");      
      this.sizeClass          = this.getControlData("bot-size-class",   "standard");
      this.togglePulses       = this.getControlData("bot-toggle-pulses", true, "bool");
      this.toggleClass        = this.getControlData("bot-toggle-class", "botanic-green");
      this.toggleVisible      = this.getControlData("bot-toggle-visible", true, "bool");
      this.toggleIcon         = this.getControlData("bot-toggle-icon", "chat_bubble_outline");
      this.botTitle           = this.getControlData("bot-title", "Powered by Botanic");
      this.botSubTitle        = this.getControlData("bot-subtitle", "Powered by Botanic Technologies");
      this.botCloseButtonTitle = this.getControlData("bot-close-button-title", "Close");
      this.closeClass         = this.getControlData("bot-close-class", "transparent");
      this.refreshClass       = this.getControlData("bot-refresh-class", "transparent");
      this.closeIcon          = this.getControlData("bot-close-icon", "expand_more");
      this.fullscreen         = this.getControlData("bot-fullscreen", false, "bool");
      this.startFullscreen    = this.getControlData("bot-start-fullscreen", false, "bool");
      this.botHandler         = this.getControlData("bot-handler", "text");
      this.externalCSS        = this.getControlData("bot-external-css", "");
      this.externalFont       = this.getControlData("bot-load-font", "");
      this.botLocale          = this.getControlData("bot-locale", "en_US")
      
      this.storageAvailable   = true;
      this.interactionsLS     = "chat-quark-interactions";
      
      if (this.recallInteractions) {
        this.consoleLog('recallInteractions: ' + this.recallInteractions);

        this.interactionsHistory = (this.storageAvailable && JSON.parse(this.hadronStorage.getItem(this.interactionsLS))) || [];
      } else {
        this.interactionsHistory = {};
      }

      
      this.twoTitles          = false;

      if (navigator.doNotTrack != 0) {
        //this.doNotTrack = true;
        this.doNotTrack = false; // Disable for now
      }

      if (this.botTitle != "" & this.botSubTitle != "") {
        this.twoTitles = true;
      }

      if (this.botIcon == "" && this.isDebug == true) {
        this.botIcon = Config.all_your_bases_are_belong_to_us + "css/images/" + Config.also_known_as + ".png";
      }


      //this.consoleLog('Config: ');
      //this.consoleLog(Config);

      this.checkDeviceCapabilites();
      this.priorityInitialization();
      this.loadPrerequsites();
      
  	}
        
    //Returns a new anonymous user id
    getAnonymousUserId(trackAnon) {console.log("TRACK ANON: ", trackAnon)
      let userId      
      if (trackAnon) {
        userId = this.hadronStorage.getItem('anonymousUserId')        
      }

      if (!userId) {
        userId = 'hadron_anon_' + this.s4() + this.s4();        
      }

      if (trackAnon) {
        this.hadronStorage.setItem('anonymousUserId', userId)        
      }
      return userId
    }
    
    //Returns an alphanumeric random string
    s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
    }

    // Check & flag what exists and if we need to monitor resources.
    checkDeviceCapabilites() {
      this.hasWebGL              = Modernizr.webgl;
      this.hasWebGLExtensions    = Modernizr.webglextensions;
      this.hasSpeechSynthesis    = Modernizr.speechsynthesis;
      this.hasSpeechRecognition  = Modernizr.speechrecognition;
      this.hasBatteryAPI         = Modernizr.batteryapi;
      this.hasLowBattery         = Modernizr.lowbattery;
      this.hasLowBandwidth       = Modernizr.lowbandwidth;
    }

    // Convert bool to yes/no
    boolToString(boolValue) {
      return (boolValue) ? "YES" : "NO";
    }

    // Just for debugging.
    showConfigState() {
      this.consoleLog("TTS Visible: "     + this.ttsVisible);
      this.consoleLog("TTS Enabled: "     + this.ttsEnabled);

      this.consoleLog("Reco Visible: "    + this.recoVisible);
      this.consoleLog("Reco Enabled: "    + this.recoEnabled);
      this.consoleLog("Reco Continuous: " + this.recoContinuous);
    }

    // This gets the process started based on the config values.
    async runControl() {
      console.log('data from launcher: ', window.xprops)      
      this.initializeChatWindow();
      if (this.use3DAvatarOnload) {        
        await this.startAvatar()        
      }      
      this.initializeVolley()      
    }

    // Do some pre-run tests.
    //JEM honor the caps reported during startup, disable functionality or hide if not allowed.
    priorityInitialization() {
      // If the server isn't secure, don't bother enabling voice reco because it won't work.
      if (this.isSecure == false) {
        //this.recoVisible = false;
        //this.ttsVisible = false;
      }

      if (this.hasSpeechSynthesis == false) {
        this.ttsVisible = false;
      }

      if (this.hasSpeechRecognition == false) {
        this.recoVisible = false;
      }

      // Mobile devices require local TTS for now.
      if (this.isMobile == true) {
        this.useLocalTTS = true;
      }
    }

    // Reads data elements from a control, applies a format and tests.
    getControlData(field, defaultValue = null, dataType = "string") {
      
      let fieldcc = this.toCamelCase(field)
      var foundData = window.xprops[fieldcc] //getting config thanks to zoid
      //foundData = this.urldecode(foundData);
      
      if (this.isUndefined(foundData)) {
          foundData = defaultValue;                            
      } 

      if (foundData !== null) {
        if (dataType == "bool") {
          foundData = this.checkBoolean(foundData);
        }      
        if (dataType == "float") {
          foundData = parseFloat(foundData)
        }
        if (dataType == "int") {
          foundData = parseInt(foundData)
        }
      }
      return  foundData;
    }

    toCamelCase(str) {
      return str.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
                    .replace('-', '')
                    .replace('_', '')
      );
    }

    // Clean up strings
    urldecode(str) {
      if (typeof str != "string") {
        return str;
      }

      return decodeURIComponent(str.replace(/\+/g, ' '));
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

    // style everything
    appendCSS(file) {
      var link = $('<link>', {href: file, type: 'text/css', rel: "stylesheet", media:"screen,print"});
      $('head').append(link);
    }

    // include any JS that may be needed
    appendJS(file) {
      var script = $('<script>', {src: file, type: "text/javascript"});
      $('head').append(script);
    }

    // dynamically load a webfont.
    appendFont(font) {
      var link = $('<link>', {href: "https://fonts.googleapis.com/css?family=" + font, rel: "stylesheet"});
      $('head').append(link);
    }

    // load icon fonts for use by materialize
    appendIcon(icon) {
      var link = $('<link>', {href: "https://fonts.googleapis.com/icon?family=" + icon, rel: "stylesheet"});
      $('head').append(link);
    }

    // Just a wrapper to allow enhanced versions of decode uri.
    decodeURI(uri) {
      var cleanURI = decodeURI(uri);
      cleanURI = cleanURI.replace(/\\/g,"");

      return cleanURI;
    }

    // Strip http or https.  This caused problems so it just does decode URI to clean stuff up.
    removeProtocol(url) {
      url = this.decodeURI(url);

      //var urlNoProtocol = url.replace(/^https?\:/i, "");

      return url;
    }


    // Custom stylesheet from user.
    getStylesheet() {
      if (this.externalCSS != "") {
        if (1||this.externalCSS.indexOf('https://') === 0) {
          this.appendCSS(this.externalCSS);
        } else {
          this.consoleLog("Ignored user stylesheet, did not begin with https://");
        }
      }
    }

    // Load any CSS, etc that the control needs.
    loadPrerequsites() {
      if (this.prereqsLoaded == true) {
        return;
      }

      this.getStylesheet();

      this.appendIcon("Material+Icons");
      this.appendFont("Lato:400,700");
      this.appendFont("Indie+Flower");

      if (this.externalFont != "") {
        this.appendFont(this.externalFont);
      }

      this.prereqsLoaded = true;
    }

    // The core initializer for the chat
    initializeChatWindow() {
      if (this.hadronButton) {
        //this.hadronButton.hide();

        var deviceHint = "quark-desktop";

        // Insert wrapper
        if (this.chromeless == false) {
          var sizeClass = deviceHint + " ";
          if (this.fullscreen == true) {
            sizeClass = "quark-full-screen";
          }

          this.chrome = $('<div>', {class: 'quark-content-overlay quark-toggle-open ' + sizeClass + ' quark_chat_' + this.sizeClass});
          var header = $('<div>', {class: 'quark-content-overlay-header'});

          var header_text = "";

          if (this.twoTitles == true) {
            var titleText    = $('<div>', {class: 'quark-content-overlay-header-text-2', text: this.botTitle});
            var subtitleText = $('<div>', {class: 'quark-content-overlay-header-subtext', text: this.botSubTitle});
            header_text = $('<div>', {class: 'quark-content-overlay-header-wrapper'}).append(titleText).append(subtitleText);
            //header_text = "<div>" + titleText.html() +  subtitleText.html() + "</div>";
          } else {
            header_text = $('<div>', {class: 'quark-content-overlay-header-text-1', text: this.botTitle});
          }

          var dashicons = $('<span>', {class: 'quark-dashicons quark-dashicons-no-alt'});

          if (this.showRefresh == true) {
            dashicons.append('<a id="hadron-refresh" title="" class="btn-floating hadron-refresh hadron-toggle-2 ' + this.refreshClass + ' hadron-toggle"><i class="material-icons">refresh</i></a>');
          }

          dashicons.append('<a id="hadron-toggle-2" title="' + this.botCloseButtonTitle + '" class="btn-floating hadron-toggle-2 ' + this.closeClass + ' hadron-toggle"><i class="material-icons">' + this.closeIcon + '</i></a>');

          var contentOverlay = $('<div>', {class: 'quark-content-overlay-container'});
          this.conversationArea = $('<div>', {id: 'quark-conversation-area'});

          contentOverlay.append(this.conversationArea);

          if (this.botIcon != "") {
            var botIcon = $('<img>', {src: this.botIcon, class: "quark-bot-icon"});
            var botSpan = $('<span>').css('float', 'left');
            botSpan.append(botIcon);
            header.append(botSpan);
          }

          header.append(dashicons);
          header.append(header_text);

          this.chrome.append(header);
          this.chrome.append(contentOverlay);

          this.container = $('<div>', {id: 'hadron-chat', class: 'quark-container'});
        } else {
          this.container = $('<div>', {id: 'hadron-chat', class: 'quark-container quark-container-chromeless ' + deviceHint});
        }

        if (this.chrome != false) {
          this.conversationArea.append(this.container);

          this.hadronButton.after(this.chrome);
          
          this.collapseButton = $("#hadron-toggle-2");
          this.collapseButton.click(() => {

            window.xprops.minimize()
            
          });

          if (this.showRefresh == true) {
            $("#hadron-refresh").click(() => {
              if (this.hijackRefresh == "") {
                this.refreshContol(true);
              } else {
                top.window.location.href = this.hijackRefresh;
              }
            });
          }
        } else {
          this.hadronButton.after(this.container);
        }

        // set up the stage
        this.quarkWrap = $('<div>', {class: 'quark-wrap'});
        this.container.append(this.quarkWrap);

        // init typing quark
        this.quarkTyping = $('<div>', {class: 'quark-typing imagine'});
        for (var dots = 0; dots < 3; dots++) {
          var dot = $('<div>', {class: "dot_" + dots + " dot"});
          this.quarkTyping.append(dot);
        }

        this.quarkWrap.append(this.quarkTyping);
        
      }
    }

    initializeVolley() {
      if (this.hideInput == false) {
        this.typeInput();
        this.textAreaEnabled(false);
      }

      if (this.chrome != false) {
        this.chrome.css({ opacity: 1.0 });
        this.chrome.fadeTo(0.25, 1.0);
      }

      this.fullyLoaded = true;

      // This may be a bad idea. This isn't firing, it isn't correct JEM
      //$(this.quarkWrap).on( "DOMMouseScroll", function( event ) {
        //event.preventDefault();
      //  event.stopPropagation();
      //  this.consoleLog('gulp DOMMouseScroll');
      //});

      // This changes nothing at all so far... Wasted effort
      //$(document).on( "mousewheel", function( event ) {
        //event.preventDefault();
      //  event.stopPropagation();
      //  this.consoleLog('gulp mousewheel');
      //});


      this.mediaView(this.mediaViewEnabled);

      this.refreshContol(false);

      // recall previous interactions
      if (this.recallInteractions) {
        var messages = [];
        var buttons = [];
        var messageObject;
        for (var i = 0; i < this.interactionsHistory.length; i++) {
          messageObject = { message: this.interactionsHistory[i].say, unadorned: false};
          messages.push(messageObject);
        }
        // This isn't quite right.  It doesn't align properly and should be made a different color so you can tell it's older text.
        var conv = { ice: { says: messages, reply: buttons.reverse() } };
        this.talk(conv);
      }    
    }

    refreshContolInner(userRequested) {
      this.textAreaEnabled(false);

      if (this.botTalksFirst == true) {
        setTimeout(() => {
          
          var firstMessage = this.botsFirstMessage || this.botsFirstMessageTrigger
          this.callBBot(firstMessage, (botSaid, cards) => {
              setTimeout(() => {
                this.textAreaEnabled(true);
              }, this.firstVolleyPause);
            });

       }, 1);

      } 
    }


    // Reloads the control. Respects botTalksFirst flag
    refreshContol(userRequested) {
      //this.mediaView(false);

      this.quarkWrap.html('');
      this.quarkWrap.append(this.quarkTyping);

    
      var animationDelay = this.animationTime * this.typeSpeed;
      if (this.doNotTrack) {
        var convo = { ice: { says: [this.doNotTrackText], reply: [] } };
        this.talk(convo);

        setTimeout(() => {
          this.refreshContolInner(userRequested);
        }, animationDelay);
      } else {
        this.refreshContolInner(userRequested);
      }
    
    }

    // Toggle logging to clean up output
    consoleLog(text) {
      if (this.showDebug == true) {
        console.log(text);
      }
    }

    // prepare next save point
    interactionsSave(say, reply) {
      if (this.storageAvailable == false) {
        return;
      }

      if (!this.recallInteractions) {
        return;
      }

      // do not memorize buttons; only user input gets memorized:
      if (say.includes("quark-button") && reply !== "reply reply-freeform" && reply !== "reply reply-pick") {
        return;
      }

      // Don't save a welcome message.
      if (say.includes(this.botWelcomeText)) {
        return;
      }

      // limit number of saves
      if (this.interactionsHistory.length >= this.recallInteractions) {
        this.interactionsHistory.shift(); // removes the oldest (first) save to make space
      }

      // save to memory
      this.interactionsHistory.push({ say: say, reply: reply });
      //this.botWelcomeText
      this.consoleLog("-----HISTORYSAVE-----");
      this.consoleLog(say);
      this.consoleLog(reply);
      this.consoleLog(this.interactionsHistory);
    }

    // commit save to localStorage
    interactionsSaveCommit() {
      if (this.storageAvailable == false) {
        return;
      }

      if (!this.recallInteractions) {
        return;
      }

      this.hadronStorage.setItem(this.interactionsLS, JSON.stringify(this.interactionsHistory));

      this.consoleLog("-----HISTORYSAVECOMMIT-----");
      this.consoleLog(this.interactionsHistory);
    }

    
    // Sets the state of the text input.  This prevents user entry if Hadron is not ready.
    textAreaEnabled(state) {
      if (state == true) {
        setTimeout(() => {
          this.inputText.prop('disabled', false);
          this.inputText.removeClass('noinput');
          //this.inputText.val('');
          this.inputText.focus();
        }, 1);
      } else {
        this.inputText.prop('disabled', true);
        this.inputText.addClass('noinput');
        //this.inputText.val('');
      }
    }

    // Creates and handles user input.
    typeInput() {
      var recoIcon;
      var imageClass;

      var inputWrap = $('<div>', {class: 'input-wrap'});
      this.inputText = $('<textarea>', {placeholder: this.botAMAText});

      if (this.disableTray == false) {
        var recoContainer = $('<div>', {class: 'quark-reco-container'});

        if (this.recoVisible) {
          if (this.recoEnabled) {
            imageClass = 'quark-reco-button-on';

            //this.showToast('I\'m listening.');

            // Start reco.
            this.startReco(true);
          } else {
            imageClass = 'quark-reco-button-off';
          }
        } else {
          imageClass = 'quark-reco-button-disabled quark-button-hidden';
        }

        recoIcon = $('<img>', {id: 'quark-reco-icon', class: imageClass, src: 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=='});
        recoIcon.click(() => {
          if (this.recoVisible) {
            if (this.recoEnabled) {
              // A click absolutely disables reco.
              this.returnToReco = false;

              this.stopReco();
              this.showToast('I\'m no longer listening.');
            } else {
              this.startReco(true);
            }
          }

          this.inputText.focus();
        });

        recoContainer.append(recoIcon);
        inputWrap.append(recoContainer);

        var ttsContainer = $('<div>', {class: 'quark-tts-container'});

        if (this.ttsVisible) {
          if (this.ttsEnabled) {
            imageClass = 'quark-tts-button-on';
          } else {
            imageClass = 'quark-tts-button-off';
          }
        } else {
          imageClass = 'quark-tts-button-disabled quark-button-hidden';
        }

        this.ttsIcon = $('<img>', {class: imageClass, src: 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=='});

        this.ttsIcon.click(() => {
          this.ttsEnable(!this.ttsEnabled)
          this.inputText.focus();

          //check if there is an audio not played because browser didnt let to. we will play it now.
          if (this.ttsEnabled && this.lastAjaxResponse) {          
            this.playAudioResponse(this.lastAjaxResponse, this.lastAjaxResponseACTR)
          }          
        });

        ttsContainer.append(this.ttsIcon);

        if (this.recoVisible == false) {
          recoContainer.css('display', 'none');
        }

        inputWrap.append(ttsContainer);
      }

      inputWrap.append(this.inputText);

      //JEM refactor
      this.inputText.keypress((e) => {
        // Discard the CR/done if the bubbles are running.
        if (this.orderQuarksRunning && e.keyCode == 13) {
          e.preventDefault();
          return;
        }

        if (e.keyCode == 13) {
          e.preventDefault();

          var userSaid = this.inputText.val();

          if (this.isStopListeningCommand(userSaid)) {
            return;
          }

          // allow user to interrupt the bot
          if (typeof(this.quarkQueue) !== false)  {
            clearTimeout(this.quarkQueue);
          }

          var lastQuark = $(".quark.say");
          lastQuark = lastQuark[lastQuark.length - 1];
          if ($(lastQuark).hasClass("reply") && !$(lastQuark).hasClass("reply-freeform")) {
            $(lastQuark).addClass("quark-hidden");
          }

          var styledUserInput = this.inputText.val();
          var sentimentPlaceholder = "";

          if (this.showSentiment) {
            sentimentPlaceholder = '<span class="quark-sentiment-placeholder">&nbsp;</span>';
          }

          if (this.hideButtonsWhenClicked) {
            $('.quark-button-wrap').hide();
          }

          this.addQuark(
            sentimentPlaceholder + '<span class="quark-user-input quark-pick right-align ' + this.botSaysClass + '">' + styledUserInput + "</span>",
            function() {},
            "reply reply-freeform"
          );

          if (this.isCommand(userSaid) == true) {
            this.inputText.val("");
            return;
          }

          //this.avatarState('acknowledge');

          // call BBot after a slight delay.  BBot can answer so quickly that it breaks behavior.
          // var userSaid = this.inputText.val();
          setTimeout(() => {
            var responseText = this.callBBot(userSaid, function(botSaid, cards) {

            });
          }, 50);

          this.inputText.val("");
        }
      });

      if (this.chrome != false) {
        this.conversationArea.after(inputWrap);
      } else {
        this.container.append(inputWrap);
      }

      this.inputText.focus();
  }

  ttsEnable(flag) {
    if (this.soundObject) {
      this.soundObject.muted = false;
    } else {      
      this.playAudio('/assets/audio/500-milliseconds-of-silence.mp3');      
    }

    /*
    this.context.resume().then(() => {
      console.log('Playback resumed successfully');
    });
    */
    if (this.ttsVisible) {
      this.changeTTSState(flag);
    }    
  }

  avatarState(state) {
    if (window.inAvatar) {
      window.inAvatar.avatarState(state);
    }
  }


  changeTTSState(state) {console.log("tts state >> " +  state)
    this.inputText.focus();

    if (this.ttsVisible) {
      this.ttsEnabled = state;

      if (state == false) {
        this.ttsIcon.addClass('quark-tts-button-off');
        this.ttsIcon.removeClass('quark-tts-button-on');

        this.pauseAudio();
      } else {
        this.ttsIcon.addClass('quark-tts-button-on');
        this.ttsIcon.removeClass('quark-tts-button-off');
      }

      this.ttsIcon.hide().show(0);
    }
  }


  // Is the input a hadron command?
  isCommand(userSaid) {
    var split = userSaid.split(' ')

    if (split.shift() != '/hadron') {
      return false
    }

    var command = split.shift()
    var params = split

    console.log('Will execute command: ' + command + ' with params:' + params.join(' '))

    if (command == 'show') {
      this.commandShow(params)    
    
    } else if (command == 'avatar') {
      this.avatarEnable(params)

    } else if (command == 'avatarconfig') {
      this.avatar3dGuiConfig(params)
    
    } else {      
      var msg = [];
      msg.push('Command not found');
      var convo = { ice: { says: msg, reply: [] } };
      setTimeout(() => {
        this.talk(convo);
      }, 1000);

    }

    return true
  }

  commandResponse(msgs) {
    if (typeof msgs == 'string') {
      var msgs_string = msgs
      msgs = []
      msgs.push(msgs_string)
    }
    
    if (this.commandResponse == 'console')
      console.log(msgs.join("\n"))
    else {
      var convo = { ice: { says: msgs, reply: [] } };
      setTimeout(() => {
        this.talk(convo);
      }, 1000);
    }
  }
  
  avatar3dGuiConfig(params) {
    if (!window.inAvatar) {
      this.commandResponse('Avatar is not active')
      return
    }

    var enabled = params[0] == 'on'
    window.inAvatar.guiConfigEnable(enabled)
    if (enabled) {
      this.commandResponse('Avatar GUI config enabled')
    } else {
      this.commandResponse('Avatar GUI config disabled')
    }
  }

  commandShow(params) {
    var msg;

    if (params[0] == 'caps') {
      msg = [];
      msg.push('Device Capabilities');
      msg.push('WebGL: ' + this.boolToString(this.hasWebGL));
      msg.push('WebGL Extensions: ' + this.boolToString(this.hasWebGLExtensions));
      msg.push('Speech Synthesis: ' + this.boolToString(this.hasSpeechSynthesis));
      msg.push('Speech Recognition: ' + this.boolToString(this.hasSpeechRecognition));
      msg.push('Battery API: ' + this.boolToString(this.hasBatteryAPI));
      msg.push('Low Battery: ' + this.boolToString(this.hasLowBattery));
      msg.push('Low Bandwidth: ' + this.boolToString(this.hasLowBandwidth));

      this.commandResponse(msg)
    } else if (params[0] == "state") {
      msg = [];
      msg.push('Hadron State');
      msg.push('TTS Visible: ' + this.boolToString(this.ttsVisible));
      msg.push('TTS Enabled: ' + this.boolToString(this.ttsEnabled));
      msg.push('Reco Visible: ' + this.boolToString(this.recoVisible));
      msg.push('Reco Enabled: ' + this.boolToString(this.recoEnabled));
      msg.push('Reco Continuous: ' + this.boolToString(this.recoContinuous));

      msg.push('Storage: ' + this.hadronStorage.provider);
      if (this.hadronStorage.provider == "HadronFauxStorage") {
        msg.push('Your browser is not allowing access to localStorage.  Please contact johnm@botanic.io with information like browser brand, version number, device (mobile, laptop, etc), OS (Windows, Linux)..');
      }

      msg.push('Is Secure: ' + this.boolToString(this.isSecure));
      if (this.isSecure == false) {
        msg.push('Since this site is not using HTTPS, functionality had to be disabled.');
      }

      this.commandResponse(msg)
    } else if (params[0] == 'config') {
      msg = [];
      msg.push('Hadron Config');
      msg.push('Also known as: ' + Config.also_known_as);
      msg.push('AYBABTU: '       + Config.all_your_bases_are_belong_to_us);
      msg.push('BBot URI: '      + Config.bbot_base_uri);
      msg.push('Bot ID: '           + Config.botId);

      this.commandResponse(msg)
    } else if (params == "3js") {
      msg = [];

      // Just hide the renderer, don't remove.  So we can return the renderer with a command after a setting changes.
      this.mediaView(false);

      if (window.inAvatar == false) {
        msg.push('Cannot inspect, renderer hasn\'t been started.');
      } else {
        msg = window.inAvatar.getRenderState();
      }

      this.commandResponse(msg)
    }
  }

  avatarEnable(param) {
    if (param[0] == 'start') {
      this.startAvatar(param[1])
    } else if (param[0] == 'stop') {
      if (window.inAvatar) {
        window.inAvatar.stopAvatar();
      } else {
        this.commandResponse('Avatar is not enabled')
      }
    } else {
      this.commandResponse('Unknown parameter')
    }
  }

  startAvatar(avatarParam) {
    return new Promise(async(resolve, reject) => {
      if (this.use3DAvatar == false || this.hasWebGL == false) {
        msg = [];
        msg.push('Cannot run');
        msg.push('Is avatar var defined: ' + this.boolToString(this.use3DAvatar));
        msg.push('Has WebGL: ' + this.boolToString(this.hasWebGL));
        convo = { ice: { says: msg, reply: [] } };

        setTimeout(() => {
          this.talk(convo);
        }, 1000);      
      }
      
      if (window.inAvatar == false) {
        let avatar = await import(/* webpackChunkName: "hadronavatar" */ './hadron.avatar.js')
        window.inAvatar = new avatar.HadronAvatar("inAvatar");
        window.inAvatar.options.ttsTimeScale = this.ttsTimeScale        
        await window.inAvatar.checkACTRInput(avatarParam);            

      }
      resolve()
    })
  }


  // Start the recognizer
  startReco(showToast) {
    
    //JEM Need to ensure this isn't necessary.
    //if (this.recoEnabled == false) {
    //  return;
    //}

    if (this.recoObject == false) {
      this.recoObject = new Artyom();

      this.recoObject.when("ERROR",function(error){
        if(error.code == "network"){
          alert("An error ocurred, artyom cannot work without internet connection !");
        }

        if(error.code == "audio-capture"){
          alert("An error ocurred, artyom cannot work without a microphone");
        }

        if(error.code == "not-allowed"){
          alert("An error ocurred, it seems the access to your microphone is denied");
        }

        this.consoleLog(error.message);
      });

      if(this.recoObject.recognizingSupported()){
        // Artyom can process commands  @TODO move this to initialization and show icon based on this
      }else{
        // This browser doesn't support webkitSpeechRecognition
        this.recoEnabled = false;
        return
      }
    }

    this.recoEnabled = true;

    if (this.recoContinuous == true) {
      this.returnToReco = true;
    } else {
      this.returnToReco = false;
    }

  
    $('#quark-reco-icon').removeClass('quark-reco-button-off');
    $('#quark-reco-icon').addClass('quark-reco-button-on');

    /* @TODO ?? this is not needed here. commenting for now
    this.recoObject.initialize({
      lang: "en-US",
      debug: true, // Show what recognizes in the Console
      listen: true, // Start listening after this
      speed: 0.9, // Talk a little bit slow
      mode: "normal", // This parameter is not required as it will be normal by default
      continuous: true//,
      //name: "Jarvis"
    });
    */
    
    if (!this.userDictation) {
      var settings = {
        continuous:true, // Don't stop never because i have https connection
        onResult:(interimText, temporalText) => {
          var isFinal = false;
          if (temporalText != "") {
            isFinal = true;
          }

          this.consoleLog("interimText: " + interimText);
          this.consoleLog("temporalText:" + temporalText);
          this.consoleLog("isFinal:" + isFinal);

          if (!isFinal) {
            this.inputText.val(interimText);
          } else {
            if (this.recoObject != false) {
              this.recoInput(temporalText);
            }

            var wasEnabled = this.recoEnabled
            this.stopReco();            
            if (wasEnabled && this.recoContinuous && this.returnToReco) {//stop/start to reset it
              this.startReco();
            }
          }
        },
        onStart:function(){
            console.log("Dictation started by the user");
        },
        onEnd:function(){
            console.log("Dictation stopped by the user");
        }
      };

      this.userDictation = this.recoObject.newDictation(settings);
    } 
    this.userDictation.start();
    if (showToast) {
      this.showToast('I\'m listening.');
    }

    console.log('start listening')
  
  }

  // Stop the recognizer.
  stopReco() {    
    console.log('stopping listening')
    if (this.recoEnabled == true) {
      $('#quark-reco-icon').removeClass('quark-reco-button-on');
      $('#quark-reco-icon').addClass('quark-reco-button-off');

      this.recoEnabled = false;

      if (this.userDictation) {
        this.userDictation.stop();
        //this.userDictation = false;
      }
    }
  }

  // Make the reco speak, mobile devices need this.
  localTTS(phrase, language = "en-US") {
    if (language == "") {
      language = "en-US";
    }

    if (this.recoObject == false) {
      this.recoObject = new Artyom();
      this.recoObject.initialize({
        lang: language,
        debug: true, // Show what recognizes in the Console
        listen: true, // Start listening after this
        speed: 0.9, // Talk a little bit slow
        mode: "normal", // This parameter is not required as it will be normal by default
        continuous: true,
        name: "Jarvis"
      });
    }

    this.recoObject.say(phrase, {
      onStart:function(){
      },
      onEnd:function(){
        if (this.returnToReco == true) {
          console.log('onend listening')
          setTimeout(function(){
            this.startReco(false);
          }, 200);
        }
      }
    });
  }

  // Compare 2 strings
  caseInsensitiveCompare(p1, p2) {
    var strippedPhrase1 = p1;
    strippedPhrase1.replace(/[\n\r]+/g, '');

    var strippedPhrase2 = p2;
    strippedPhrase2.replace(/[\n\r]+/g, '');

    var areEqual = (strippedPhrase1.toUpperCase() === strippedPhrase2.toUpperCase());

    return areEqual;
  }

  // Is it a stop command?
  isStopListeningCommand(phrase) {
    var areEqual = this.caseInsensitiveCompare(phrase, this.stopListeningCommand);

    if (areEqual) {
      this.showToast('I am no longer listening.');

      this.inputText.val('');
      this.returnToReco = false; 
      this.stopReco();
      return true;
    }

    return false;
  }

  // Receives the spoken text, sends to chat input.
  recoInput(phrase) {
    this.consoleLog("recoInput: " + phrase);

    if (this.isStopListeningCommand(phrase)) {
      return;
    }

    this.inputText.val(phrase);

    // Press enter
    var e = $.Event("keypress");
    e.which = 13; //choose the one you want
    e.keyCode = 13;
    this.inputText.trigger(e);
  }

  // accept JSON & create quark
  talk(convo, here = "ice") {
    if (convo == false) {
      if (this.botWelcomeText == false || this.botWelcomeText == "") {
        return;
      }

      if (this.hideInput == true) {
        convo = { ice: { says: [this.botWelcomeText], reply: [{ question: "Hi!", answer: "hi", type: "echo"}] } };
      } else {
        convo = { ice: { says: [this.botWelcomeText], reply: [] } };
      }
    }

    // all further .talk() calls will append the conversation with additional blocks defined in convo parameter
    this._convo = Object.assign(this._convo, convo); // POLYFILL REQUIRED FOR OLDER BROWSERS

    this.reply(this._convo[here]);
    if (here) {
      this.standingAnswer = here;
    }
  }

  // This starts the reply process, adds the user input, does ... etc
  reply(turn) {
    this.iceBreaker = typeof(turn) === "undefined";
    turn = !this.iceBreaker ? turn : this._convo.ice;
    var questionsHTML = ''; // "<div class='quark-button-wrap'>";

    if (!turn) {
      return;
    }

    if (turn.reply !== undefined) {
      turn.reply.reverse();
      for (var i = 0; i < turn.reply.length; i++) {
        ((el, count) => {
          var clickEvent = 'window.this.answer("' + el.answer + '", "' + el.question + '", "' + el.type + '");';
          var questionHTML = $('<a>', {class: "quark-button quark-choices btn left-align " + this.buttonClass, style:"animation-delay: " + this.animationTime / 2 * count + "ms", text: el.question, onClick: clickEvent});
          questionsHTML = questionsHTML + questionHTML.prop('outerHTML');

          if (i != (turn.reply.length - 1)) {
            questionsHTML = questionsHTML + "<br />";
          }
        })(turn.reply[i], i);
      }
    }

    if (questionsHTML != "") {
      questionsHTML = "<div class='quark-button-wrap'>" + questionsHTML + '</div>';
    }

    this.orderQuarkState(true);

    this.orderQuarks(turn.says, () => {
      this.orderQuarkState(false);

      this.quarkTyping.removeClass("imagine");

      if (questionsHTML !== "") {
        this.addQuark(questionsHTML, function() {}, "says-buttons");
      } else {
        this.quarkTyping.addClass("imagine");
      }
    });
  }

  // Sets the state and can message to control behavior
  orderQuarkState(state) {
    this.orderQuarksRunning = state;

    if (state == true) {
      //this.textAreaEnabled(false);
    } else {
      //this.textAreaEnabled(true);
    }
  }

  // This receives the info from BBot both text and card array
  processResponse(botSaid, cards, bbot_response) {
    if (this.isUndefined(botSaid) == true) {
      return;
    }

    this.consoleLog(botSaid);
    this.consoleLog(cards);

    var messageObject;
    var buttons = [];

    this.threedVisualizerID = false;

    var messages = [];
    for (var index = 0, len = botSaid.length; index < len; ++index) {
      if (botSaid[index].speech != "") {
        //var botSaidAfter = this.parseBotResponse(botSaid[index].speech);
        var botSaidAfter = botSaid[index].speech;

        var withMedia = this.convertMedia(botSaidAfter);

        if (withMedia == false) {
          messageObject = { message: botSaidAfter, unadorned: false};
        } else {
          messageObject = { message: withMedia, unadorned: true};
        }
        messages.push(messageObject);
      }
    }

    if (botSaid.length == 0) {
        messageObject = { message: "", unadorned: false};
        messages.push(messageObject);
        console.log("Odd. The bot was silent.")
    }

    var media = "";
    var cardList = cards[0] || false;

    if (cardList != false &&  cardList.length > 0) {
      for (let c of cardList) {
        var res = this.processCard(c);

        if (this.isUndefined(res) == false) {
          var aMesg = res.msg;

          if (aMesg != "") {
            messages.push(aMesg);
          }

          for (let b of res.btn) {
            buttons.push(b);
          }
        }
      }
    }

    //convo = { ice: { says: [botWelcomeText], reply: [] } }
    var conv = { ice: { says: messages, reply: buttons.reverse() } };
    this.talk(conv);

    $('#mediaplayer').on('ended', function() {
      //console.log('ended');
      if (this.returnToReco == true) {
        //console.log('recoResume');
        setTimeout(function(){
          this.startReco(false);
        }, 200);
      }
    });

    if (this.threedVisualizerID != false) {
    }
  }

  replaceAll(string, search, replacement) {
    return string.replace(new RegExp(search, 'g'), replacement);
  }

  // Look for a trigger phrase OR fix errors in certain types of data.....
  parseBotResponse(botSaid) {
   
    if (botSaid.includes("HADRONSTARTVOICERECO")) {
      botSaid = botSaid.replace("HADRONSTARTVOICERECO", "");
      this.recoEnabled = true;
      this.returnToReco = true;
    }

    if (botSaid.includes("HADRONSTOPVOICERECO")) {
      botSaid = botSaid.replace("HADRONSTOPVOICERECO", "");
      this.returnToReco = false;
      this.stopReco();
    }

    if (botSaid.includes("HADRONBREAK1")) {
      botSaid = botSaid.replace("HADRONBREAK1", "");
    }

    if (botSaid.includes("HADRONBREAK2")) {
      botSaid = botSaid.replace("HADRONBREAK2", "");
    }

    return botSaid;
  }


  // Create an embed/media/etc based on some input.
  convertMedia(html) {
    var cls = 'class="responsive-video"';
    var frm = '<div class="responsive-container"><iframe '+cls+' src="//_URL_" frameborder="0" allowfullscreen id="mediaplayer"></iframe></div>';
    var converts = [
      {
        rx: /^(?:https?:)?\/\/(?:www\.)?vimeo\.com\/([^\?&"]+).*$/g,
        tmpl: frm.replace('_URL_',"player.vimeo.com/video/$1")
      },
      {
        rx: /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|user\/.+\/)?([^\?&"]+).*$/g,
        tmpl: frm.replace('_URL_',"www.youtube.com/embed/$1")
      },
      {
        rx: /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube-nocookie\.com)\/(?:watch\?v=|embed\/|v\/|user\/.+\/)?([^\?&"]+).*$/g,
        tmpl: frm.replace('_URL_',"www.youtube-nocookie.com/embed/$1")
      },
      {
        rx: /(^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?\.(?:jpe?g|gif|png|svg)\b.*$)/gi,
        tmpl: '<a '+cls+' href="$1" target="_blank"><img src="$1" /></a>'
      },
    ];
    for (var i in converts)
      if (converts[i].rx.test(html.trim())) {

        return html.trim().replace(converts[i].rx, converts[i].tmpl);
      }

    return false;
  }


  // This handles a specific card, it will be changed so we can dynamically insert a replacement renderer.
  // Also support adding some JS through another class that gives new renderer types rather than clutter the main class.
  processCard(card) {
    var buttons = [];
    var message = "";
    var media = "";
    var image = "";
    var video = "";
    var audio = "";
    var text = "";

    if (card != false) {
      var contentType = "";
      if (card.contentType == "application/vnd.microsoft.card.hero") {
        contentType = "hero";
      } else if (card.contentType == "application/vnd.microsoft.card.video") {
        contentType = "video";
      } else if (card.contentType == "application/vnd.microsoft.card.audio") {
        contentType = "audio";
      } else if (card.contentType == "application/vnd.microsoft.card.image") {
        contentType = "image";
      } else if (card.contentType == "application/vnd.botanic.card.3dvisualizer") {
        contentType = "3dvisualizer";
      }

      //JEM CLEAN Make card renderer objects, get this out of here.  Pass the card data into the object and let it do the rest.
      if (contentType == "video") {
        try {
          image = card.content.image.url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        try {
          video = card.content.media[0].url || "";
          video = this.removeProtocol(video);
        } catch(error) {
          video = "";
        }

        if (video != "") {
          message = this.videoHandler(image, video);

          if (video.endsWith('fullscreen')) {
            this.mediaView(true);
            this.mediaOverlayContent.html(message.message);

            return;
          }
        }
      }

      if (contentType == "audio") {
        try {
          image = card.content.image.url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        try {
          audio = card.content.media[0].url || "";
          audio = this.removeProtocol(audio);
        } catch(error) {
          audio = "";
        }

        // JEM need to toggle controls and detect mimetype properly.  Same with video.
        if (audio != "") {
          media  = '<audio controls class="responsive-audio">';
          media += '<source src="' + audio + '" type="audio/mpeg">';
          media += '</audio>';

          message = { message: media, unadorned: true};
        }
      }

      if (contentType == "image") {
        try {
          image = card.content.images[0].url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        // JEM need to toggle controls and detect mimetype properly.  Same with video.
        if (image != "") {
          message = this.imageHandler(image);
        }
      }

      if (contentType == "hero") {
        try {
          image = card.content.images[0].url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        text = card.content.text || "";

        if (image != "" && text != "") {
          media = `<div class="row responsive-card">
        <div class="col s12 m12">
          <div class="card">
            <div class="card-image">
              <img src="` + image + `">
              <span class="card-title"></span>
            </div>
            <div class="card-content">
              <p>` + text + `</p>
            </div>
          </div>
        </div>
      </div>`;

          message = { message: media, unadorned: true};
        }
      }

      // This code needs to be more flexible.  Know the difference between a SkypeCard, AdaptiveCard and HadronCard.
      // Should be pulled into a separate class and processed so this is cleaner.
      if (typeof card.content.buttons !== "undefined") {
        if (card.content.buttons.length > 0) {
          for (var index = 0, len = card.content.buttons.length; index < len; ++index) {
            var jsonButton = card.content.buttons[index];
            var button;

            if (jsonButton.type == 'openUrl') {
              button = { question: jsonButton.title, answer: jsonButton.value, type: jsonButton.type};
            } else {
              button = { question: jsonButton.title, answer: jsonButton.value, type: jsonButton.type};
            }
            buttons.push(button);
          }
        }
      }
    }

    var obj = {};
    obj.msg = message;
    obj.btn = buttons;

    return obj;
  }

  // wrap image
  imageHandler(image) {
    var media  = '<img src="' + image + '" class="responsive-img" />';
    var message = { message: media, unadorned: true};

    return message;
  }

  // Video handling
  videoHandler(image, video, autoplay) {
    var media = "";

    if (video.endsWith('fullscreen') || this.mediaViewEnabled) {
      media  = '<video id="mediaplayer" class="responsive-video" poster="' + image + '" autoplay>';
    } else {
      media  = '<video id="mediaplayer" class="responsive-video" poster="' + image + '" autoplay controls controlsList="nodownload">';
    }

    var mediaType = "video/mp4";

    if(video.indexOf("//www.youtube") !== -1) {
      // YouTube embedding.
      mediaType = "video/youtube";
      media = '<iframe class="responsive-video" src="' + video + '" frameborder="0" allowfullscreen></iframe>';

      //console.log('URL passed the test');
    } else if(video.indexOf("//vimeo") !== -1) {
      // Vimeo embed.
      mediaType = "video/vimeo";
      media = '<iframe src="' + video + '" class="responsive-video" frameborder="0"></iframe>';

      //console.log('URL passed the test');
    } else {
      // Native...
      media += '<source src="' + video + '" type="' + mediaType + '">';
      media += '</video>';
    }

    var message = { message: media, unadorned: true};

    return message;
  }

  // Make a call to BBot to do the TTS.  Could also speak locally in some cases but this allows for a custom voice.
  handleTTS(url, startCallback, endCallback, delay) {    
    if (url == false || this.ttsEnabled == false) {
      if (startCallback) {
        startCallback();
      }
      return;
    }
    this.stopReco();
    var p = this.playAudio(url, startCallback, endCallback, delay)          
    p.then((e) => {
        //successful playback        
        this.lastAjaxResponse = null //all done. clear this
        this.lastAjaxResponseACTR = null
        this.ttsURIToCall = null
      }).catch((e) => {
        console.log('Play error', e)
        //this might be because th browser dont let autoplay         
        this.ttsEnable(false) //set to false then the user will enable it        
        this.showToast('Click on speaker icon to enable audio.')        
      })
      return p
  }


  // Only pause if necessary, Chrome complained sometimes.
  pauseAudio() {
    
    if (this.soundObject != false) {
     /* if (this.soundObject.duration > 0 && !this.soundObject.paused) {
        this.soundObject.pause();
      }

      this.soundObject.muted = false;*/
      console.log('stopping audio')
      this.soundObject.pause()
    }
  }


  // Plays an audio file and stops an existing audio file.  Used by TTS, make be used by receiving an audio card.
  playAudio(url, startCallback, endCallback, delay) {
    return new Promise((resolve, reject) => {

      this.showConfigState();
      this.pauseAudio();

    
      //this method allows to have total control of events
      var req = new XMLHttpRequest();
      //req.withCredentials = true;
      req.crossDomain = true
      req.open('GET', url, true);
      req.responseType = 'blob';
      
      
      req.onload = function() {
        console.log('audio loaded with status ' + this.status )
        // Onload is triggered even on 404
        // so we need to check the status code
        if (this.status === 200) {
            var audioSrc = URL.createObjectURL(this.response); // IE10+
            // Video is now downloaded
            // and we can set it as source on the video element
            inControl.soundObject = new Audio();

            // If it was off, keep it off!
            // If there is a pause, no voice detected for a few seconds, turn off all reco.
            // If the user clicks the stop, it stops.
            // If the user says "stop listening" or something similar, it stops.
            var pauseEndEvent = () => {
              console.log('sound ended')

              if (inControl.returnToReco == true) {
                setTimeout(function(){
                  inControl.startReco(false);
                }, 200);
              }
              if (endCallback) {
                console.log('playAudio() endCallback')
                endCallback();
              }
              inControl.soundObject.onended = undefined
              inControl.soundObject.onpause = undefined  
            };
            inControl.soundObject.onended = pauseEndEvent
            inControl.soundObject.onpause = pauseEndEvent

            inControl.soundObject.src = audioSrc;
            console.log('playing audio')          
            setTimeout(() => {
              var playPromise = inControl.soundObject.play()
              if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Autoplay started!
                    resolve()
                    if (startCallback) {
                      startCallback()
                    }
                }).catch(error => {
                    // Autoplay was prevented.                  
                    console.log(error)
                    reject(error)
                });
              }            
            }, delay || 0)            
        } else {
          console.log('Error on audio playback')
          if (inControl.returnToReco == true) {
                setTimeout(function(){
                  inControl.startReco(false);
                }, 200);
            }
        }
      }
      
      req.onerror = (e) => {
          console.log('error on audio playing')
          console.log(e)

      }
      
      req.send();
      console.log('start load audio')

    })    
  }


  // See if the avatar system is running.  This test may not be complete enough.
  isACTRRunning() {
    if (this.use3DAvatar == true && window.inAvatar != false) {
      return true;
    } else {
      return false;
    }
  }


  // Calls BBot to get chat response based on user input.
  callBBot(text, callback) {
    var uri = "";
    var that = this;

    // Reset this variable each time so TTS can work when it was appropriate.
    this.lastSpokenURI = false;

  
    var ttsTimeScale;    
    if (this.isACTRRunning()) {
      ttsTimeScale = window.inAvatar.options.ttsTimeScale      
    } else {
      ttsTimeScale = this.ttsTimeScale
    }
    var req_params = {
        'orgId': 1,
        'botId': this.botId,
        'userId': this.userId,   
        'pubToken': this.pubToken,                
        'actrEnabled': this.isACTRRunning(),         
        'ttsEnabled': this.ttsEnabled && !this.useLocalTTS,
        'ttsTimeScale': ttsTimeScale,     
        'ttsVoiceId': this.ttsVoiceId,
        'ttsLocale': this.ttsLocale,        
        'input': {
            'text': text
        }
    };
    
    $.ajax({url: this.BBotBaseUrl,
        type: 'post',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(req_params),
        context: this,
        success: function(response) {
          this.ajaxResponse(response, callback)  
          
        },
        error: function(jqXHR, textStatus, errorThrown) { 
          console.log("HTTP Code: " + textStatus + " - error: " + errorThrown)
          this.ajaxResponse(jqXHR.responseJSON, callback)          
        }    
    })
  }

  ajaxResponse(response, callback) {    
    this.lastAjaxResponse = response //will be used if browser dont let play audio. There will be an exception so this values will be kept stored until it is playback

    var json_obj = this.processBbotResponse(response);

    if (response.tts) {
      this.ttsURIToCall = response.tts.url 
    } 
    
    this.showTextResponse(response)
    this.playAudioResponse(response)

    callback(json_obj.messages, json_obj.cards);
  }

  showTextResponse(response) {
    var json_obj = this.processBbotResponse(response);
    if (this.isACTRRunning() == true) {    
      window.inAvatar.processMessages(json_obj.messages || false);
    } else {      
      this.processResponse(json_obj.messages, json_obj.cards, response);
    }
  }

  playAudioResponse(response) {
    var json_obj = this.processBbotResponse(response);
    if (this.isACTRRunning() == true) {
      window.inAvatar.processACTR(response.actr || false);      
    } else {
      if (this.ttsEnabled == true && this.useLocalTTS == true) {
          this.localTTS(json_obj.bot_said || "");
      }

      // Do not reset the tts var is actr is running, it needs it.
      if (this.mediaViewEnabled == true) {
        this.ttsURIToCall = null;
      }

      // Do not speak if actr is running, it will do it.
      if (this.ttsURIToCall && this.isACTRRunning() == false) {
        this.handleTTS(this.ttsURIToCall, null, null, 500)                    
      }      
    }        
  }


  //convert legacy protocol to bbot protocol    
  processBbotResponse(bbot_response) {          
      
      var messages = [];
      var cards = [];
      var buttons = [];
      var speech_synth = ''
      bbot_response.output.forEach(function(br, index, array) {
          //get bbot response type
          var type = Object.keys(br)[0];
          
          if (type == 'text') {
              messages.push({
                  'speech': br[type], 
                  'type': 0
              });
          }
          if (type == 'image') {
              cards.push({
                  'contentType': 'application/vnd.microsoft.card.image', 
                  'content': {
                      'images': [{
                              'url': br[type].url
                          }]
                  }});
          }
          if (type == 'video') {
              cards.push({
                  'contentType': 'application/vnd.microsoft.card.video', 
                  'content': {
                      'media': [{
                              'url': br[type].url
                          }],                      
                      'image': [{
                              'url': ''
                          }]
                  }});
          }
          if (type == 'audio') {
              cards.push({
                  'contentType': 'application/vnd.microsoft.card.audio', 
                  'content': {
                      'media': [{
                              'url': br[type].url
                          }],                      
                      'image': [{
                              'url': ''
                          }]
                  }});
          }
          if (type == 'button') {
              buttons.push({             
                          'title': br[type].text,
                          'value': br[type].postback,
                          'type':'postback'
                      }
              
              );
          }
                          
      });
      
      if (buttons.length) {
          cards.push({
              'content': {
                  'buttons': buttons
              }
          });
      }
      
      var json_obj = {
          'messages': messages,
          'cards': [cards],              
      };
              
      return json_obj;
  }



  // Enable/disable media view mode.  In media view mode an overlay holds the media object, is stationary and has a one line element to display the last user test.
  mediaView(state) {
    this.mediaViewEnabled = state;

    // Create the overlay components and assign them so other functions can interact with it.
    if (state == true) {
      if ($('.quark-media-content').length != 0) {
        return this.mediaOverlayContent;
      }

      // Disable TTS, it would be bad over a video preso.
      //this.changeTTSState(false);

      this.mediaViewPreservedState = this.container;

      this.mediaOverlay = $('<div>', {class: "quark-media-overlay"});
      this.mediaOverlayContent = $('<div>', {class: "quark-media-content"});

      this.mediaOverlay.append(this.mediaOverlayContent);

      this.container.append(this.mediaOverlay);

      return this.mediaOverlayContent;
    } else {
      if ($('.quark-media-content').length != 0) {
        $('.quark-media-content').remove();
        $('.quark-media-overlay').remove();
      }

      // restore default view
      if (this.mediaViewPreservedState != false) {
        this.container = this.mediaViewPreservedState;
      }
    }

    return false;
  }

  // Show response when mediaView is true.
  mediaViewResponse(message) {
    this.mediaOverlayResponse.html(message);
  }

  // Insert the media container, e.g. a video player or 3D avatar.
  mediaViewContent(type) {
    // Avatars require a bit more overhead than embedded a video.
    if (type == "3D") {

    } else {

    }
  }

  // navigate "answers"
  answer(key, content, type) {
    if (this.hideButtonsWhenClicked) {
      var sentimentPlaceholder = "";

      if (this.showSentiment) {
        sentimentPlaceholder = '<span class="quark-sentiment-placeholder">&nbsp;</span>';
      }

      $('.says-buttons').hide();

      this.addQuark(
        sentimentPlaceholder + '<span class="quark-user-input quark-pick right-align ' + this.botSaysClass + '">' + key + "</span>",
        function() {},
        "reply reply-freeform"
      );
    }

    if (type != 'openUrl') {
      var responseText = this.callBBot(key, function(botSaid, cards) {
      });
    } else {
      var win = window.open(key, '_blank');
      win.focus();
      return;
    }

    var func = function(key) {
      typeof(window[key]) === "function" ? window[key]() : false;
    };

    this._convo[key] !== undefined ? (this.reply(this._convo[key]), (this.standingAnswer = key)) : func(key);

    // add re-generated user picks to the history stack
    if (this._convo[key] !== undefined && content !== undefined) {
      this.interactionsSave(
        '<span class="quark-button reply-pick">' + content + "</span>",
        "reply reply-pick"
      );
    }
  }

  // api for typing quark
  think() {
    this.quarkTyping.removeClass("imagine");

    this.stop = function() {
      this.quarkTyping.addClass("imagine");
    };
  }

  // "type" each message within the group
  orderQuarks(q, callback) {
    var start = () => {
      setTimeout(() => {
        callback();
      }, this.animationTime);
    };

    var position = 0;
    for (var nextCallback = position + q.length - 1; nextCallback >= position; nextCallback--) {
      ((callback, index) => {
        start = () => {
          this.addQuark(q[index], callback);
        };
      })(start, nextCallback);
    }
    start();
  }

  // create a quark
  addQuark(say, posted, reply, live) {    
    reply = typeof(reply) !== "undefined" ? reply : "";
    live = typeof(live) !== "undefined" ? live : true; // quark that are not "live" are not animated and displayed differently
    var animationTime = live ? this.animationTime : 0;
    var typeSpeed = live ? this.typeSpeed : 0;
    var unadorned = false;
    var replyClass = "";

    if (!say) {
      return
    }

    // create quark element
    if (this.isUndefined(say.unadorned) == false) {
      unadorned = say.unadorned;
      say = say.message;
    }

    if (unadorned == false) {
      if (reply == false) {
        replyClass = this.botReplyClass;
      } else {
        replyClass = "";
      }

      if (this.useFlowText == true) {
        replyClass += " flow-text ";
      }

      this.quark = $('<div>', {class: replyClass + " quark imagine " + (!live ? " history " : "") + reply});
      this.quarkContent = $('<span>', {class: "quark-content"});
      this.quarkContent.html(say);
      this.quark.append(this.quarkContent);
    } else {
      this.quark = $('<div>', {class: reply + " quark-unadorned imagine "});
      this.quarkContent = $('<span>', {class: ""});
      this.quarkContent.html(say);
      this.quark.append(this.quarkContent);
    }

    var target = document.getElementsByClassName("quark-wrap");
    target[0].insertBefore(this.quark[0], this.quarkTyping[0]);

    // answer picker styles
    if (reply !== "") {
      var quarkButtons = this.quarkContent.find(".quark-button");

      this.quark.click((el) => {
        $(el.srcElement).addClass("quark-picked");

        for (var i = 0; i < quarkButtons.length; i++) {
          ;(function(el) {
            if (this.hideButtonsWhenClicked) {
              $(el).addClass("quark-hide-clicked-button");
              $('.quark-button-wrap').hide();
              //el.style.width = 0 + "px";
              //el.classList.contains("quark-pick") ? (el.style.width = "") : false;
            }
            el.removeAttribute("onclick");
          })(quarkButtons[i]);
        }
      });
    }

    if (reply == "says-buttons") {
      $('.says-buttons').off("click");
    }

    // time, size & animate
    var wait = live ? animationTime * 2 : 0;
    var minTypingWait = live ? animationTime * 6 : 0;
    if (say.length * typeSpeed > animationTime && reply == "") {
      wait += typeSpeed * say.length;
      if (wait < minTypingWait) {
          wait = minTypingWait;
      }

      setTimeout(() => {
        this.quarkTyping.removeClass("imagine");
      }, animationTime);
    }

    if (live) {
       setTimeout(() => { this.quarkTyping.addClass("imagine"); }, wait - animationTime * 2);
     }


     this.quarkQueue = setTimeout(() => {
       this.quark.removeClass("imagine");

       var quarkWidthCalc = parseInt(this.quarkContent[0].offsetWidth * 1, 10) + this.widerBy;

       if (quarkWidthCalc <= this.widerBy) {
         quarkWidthCalc = 360 * 0.4;
       }

       var maxQuarkWidth = parseInt(this.quarkWrap.width(), 10) - 35;
       if (maxQuarkWidth <= this.widerBy) {
         maxQuarkWidth = 360 * 0.4;
       }

       quarkWidthCalc = Math.min(quarkWidthCalc, maxQuarkWidth);

       quarkWidthCalc = quarkWidthCalc + "px";

       var isResponsive = false;
       var isResponsiveImage = this.quark.find('.responsive-img');
       var isResponsiveVideo = this.quark.find('.responsive-video');
       var isResponsiveAudio = this.quark.find('.responsive-audio');
       var isResponsiveCard  = this.quark.find('.responsive-card');

       if (isResponsiveImage.length > 0 || isResponsiveVideo.length > 0 || isResponsiveAudio.length > 0 || isResponsiveCard.length > 0) {
         isResponsive = true;
       }

       if (isResponsiveVideo) {

       }

       if (isResponsive == false) {
         this.quark.css("width", reply == "" ? quarkWidthCalc : "");
       }

       this.quark.addClass("say");
       this.quark.fadeTo(0.5, 0).fadeTo(2, 1);
       posted();

       // save the interaction
       if (!this.iceBreaker) {
         this.interactionsSave(say, reply);
         this.interactionsSaveCommit();
       }

       // animate scrolling
       var containerHeight = this.container[0].offsetHeight;
       var scrollDifference = this.quarkWrap[0].scrollHeight - this.quarkWrap[0].scrollTop;
       var scrollHop = (scrollDifference) / 200;

       if (scrollHop > 3) {
         scrollHop = scrollHop * 3;
       }

       var scrollQuarks = () => {
         for (var i = 1; i <= scrollDifference / scrollHop; i++) {
           var self = this
           ;(function() {
             setTimeout(() => {
               if ((self.quarkWrap[0].scrollHeight - self.quarkWrap[0].scrollTop) > containerHeight) {
                 var sTop = self.quarkWrap[0].scrollTop + scrollHop;
                 self.quarkWrap[0].scrollTop = sTop;
               }
             }, i * 5);
           })();
         }
       };
       setTimeout(scrollQuarks, animationTime / 2);
     }, wait + animationTime * 2);
  }

  // Try to correct scroll position.
  resetScrollPos(selector) {
    var divs = document.querySelectorAll(selector);
    for (var p = 0; p < divs.length; p++) {
      if (Boolean(divs[p].style.transform)) { //for IE(10) and firefox
        divs[p].style.transform = 'translate3d(0px, 0px, 0px)';
      } else { //for chrome and safari
        divs[p].style['-webkit-transform'] = 'translate3d(0px, 0px, 0px)';
      }
    }
  }

  showToast(text, heading, icon) {
    text = text || false;
    heading = heading || false;
    icon = icon || false;

    if (text == false) {
      return;
    }

    if (heading == false && icon == false) {
      $.toast({text: text, position: 'bottom-right'});
    } else {
      $.toast({heading: heading, text: text, icon: icon, position: 'bottom-right'});
    }
  }


  showToastDebug(text, heading, icon) {
    if (this.showDebug == false) {
      console.log('showToastDebug: ' + text);

      return;
    }

    text = text || false;
    heading = heading || false;
    icon = icon || false;

    if (text == false) {
      return;
    }

    if (heading == false && icon == false) {
      $.toast({text: text, position: 'bottom-right'});
    } else {
      $.toast({heading: heading, text: text, icon: icon, position: 'bottom-right'});
    }
  }
}

// jQuery toast plugin created by Kamran Ahmed copyright MIT license 2015
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {
    "use strict";

    var Toast = {

        _positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
        _defaultIcons : ['success', 'error', 'info', 'warning'],

        init: function (options, elem) {
            this.prepareOptions(options, $.toast.options);
            this.process();
        },

        prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },

        process: function () {
            this.setup();
            this.addToDom();
            this.position();
            this.bindToast();
            this.animate();
        },

        setup: function () {

            var _toastContent = '';

            this._toastEl = this._toastEl || $('<div></div>', {
                class : 'jq-toast-single'
            });

            // For the loader on top
            _toastContent += '<span class="jq-toast-loader"></span>';

            if ( this.options.allowToastClose ) {
                _toastContent += '<span class="close-jq-toast-single">&times;</span>';
            }

            if ( this.options.text instanceof Array ) {

                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                }

                _toastContent += '<ul class="jq-toast-ul">';
                for (var i = 0; i < this.options.text.length; i++) {
                    _toastContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
                }
                _toastContent += '</ul>';

            } else {
                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                }
                _toastContent += this.options.text;
            }

            this._toastEl.html( _toastContent );

            if ( this.options.bgColor !== false ) {
                this._toastEl.css("background-color", this.options.bgColor);
            }

            if ( this.options.textColor !== false ) {
                this._toastEl.css("color", this.options.textColor);
            }

            if ( this.options.textAlign ) {
                this._toastEl.css('text-align', this.options.textAlign);
            }

            if ( this.options.icon !== false ) {
                this._toastEl.addClass('jq-has-icon');

                if ( $.inArray(this.options.icon, this._defaultIcons) !== -1 ) {
                    this._toastEl.addClass('jq-icon-' + this.options.icon);
                };
            };

            if ( this.options.class !== false ){
                this._toastEl.addClass(this.options.class)
            }
        },

        position: function () {
            if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {

                if ( this.options.position === 'bottom-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        bottom: 20
                    });
                } else if ( this.options.position === 'top-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: 20
                    });
                } else if ( this.options.position === 'mid-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: ( $(window).outerHeight() / 2 ) - this._container.outerHeight()/2
                    });
                } else {
                    this._container.addClass( this.options.position );
                }

            } else if ( typeof this.options.position === 'object' ) {
                this._container.css({
                    top : this.options.position.top ? this.options.position.top : 'auto',
                    bottom : this.options.position.bottom ? this.options.position.bottom : 'auto',
                    left : this.options.position.left ? this.options.position.left : 'auto',
                    right : this.options.position.right ? this.options.position.right : 'auto'
                });
            } else {
                this._container.addClass( 'bottom-left' );
            }
        },

        bindToast: function () {

            var that = this;

            this._toastEl.on('afterShown', function () {
                that.processLoader();
            });

            this._toastEl.find('.close-jq-toast-single').on('click', function ( e ) {
                e.preventDefault();

                if( that.options.showHideTransition === 'fade') {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.fadeOut(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition === 'slide' ) {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.slideUp(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.hide(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                }
            });

            if ( typeof this.options.beforeShow == 'function' ) {
                this._toastEl.on('beforeShow', function () {
                    that.options.beforeShow(that._toastEl);
                });
            }

            if ( typeof this.options.afterShown == 'function' ) {
                this._toastEl.on('afterShown', function () {
                    that.options.afterShown(that._toastEl);
                });
            }

            if ( typeof this.options.beforeHide == 'function' ) {
                this._toastEl.on('beforeHide', function () {
                    that.options.beforeHide(that._toastEl);
                });
            }

            if ( typeof this.options.afterHidden == 'function' ) {
                this._toastEl.on('afterHidden', function () {
                    that.options.afterHidden(that._toastEl);
                });
            }

            if ( typeof this.options.onClick == 'function' ) {
                this._toastEl.on('click', function () {
                    that.options.onClick(that._toastEl);
                });
            }
        },

        addToDom: function () {

             var _container = $('.jq-toast-wrap');

             if ( _container.length === 0 ) {

                _container = $('<div></div>',{
                    class: "jq-toast-wrap",
                    role: "alert",
                    "aria-live": "polite"
                });

                $('body').append( _container );

             } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
                _container.empty();
             }

             _container.find('.jq-toast-single:hidden').remove();

             _container.append( this._toastEl );

            if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {

                var _prevToastCount = _container.find('.jq-toast-single').length,
                    _extToastCount = _prevToastCount - this.options.stack;

                if ( _extToastCount > 0 ) {
                    $('.jq-toast-wrap').find('.jq-toast-single').slice(0, _extToastCount).remove();
                }

            }

            this._container = _container;
        },

        canAutoHide: function () {
            return ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) );
        },

        processLoader: function () {
            // Show the loader only, if auto-hide is on and loader is demanded
            if (!this.canAutoHide() || this.options.loader === false) {
                return false;
            }

            var loader = this._toastEl.find('.jq-toast-loader');

            // 400 is the default time that jquery uses for fade/slide
            // Divide by 1000 for milliseconds to seconds conversion
            var transitionTime = (this.options.hideAfter - 400) / 1000 + 's';
            var loaderBg = this.options.loaderBg;

            var style = loader.attr('style') || '';
            style = style.substring(0, style.indexOf('-webkit-transition')); // Remove the last transition definition

            style += '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + loaderBg + ';';


            loader.attr('style', style).addClass('jq-toast-loaded');
        },

        animate: function () {

            var that = this;

            this._toastEl.hide();

            this._toastEl.trigger('beforeShow');

            if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
                this._toastEl.fadeIn(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
                this._toastEl.slideDown(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else {
                this._toastEl.show(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            }

            if (this.canAutoHide()) {
                var that = this;

                window.setTimeout(function(){

                    if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.fadeOut(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.slideUp(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.hide(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    }

                }, this.options.hideAfter);
            }
        },

        reset: function ( resetWhat ) {

            if ( resetWhat === 'all' ) {
                $('.jq-toast-wrap').remove();
            } else {
                this._toastEl.remove();
            }

        },

        update: function(options) {
            this.prepareOptions(options, this.options);
            this.setup();
            this.bindToast();
        },

        close: function() {
            this._toastEl.find('.close-jq-toast-single').click();
        }
    };

    $.toast = function(options) {
        var toast = Object.create(Toast);
        toast.init(options, this);

        return {

            reset: function ( what ) {
                toast.reset( what );
            },

            update: function( options ) {
                toast.update( options );
            },

            close: function( ) {
            	toast.close( );
            }
        };
    };

    $.toast.options = {
        text: '',
        heading: '',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        loader: true,
        loaderBg: '#9EC600',
        stack: 5,
        position: 'bottom-left',
        bgColor: false,
        textColor: false,
        textAlign: 'left',
        icon: false,
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {},
        onClick: function () {}
    };

})( jQuery, window, document );

//conect iframe with parent
zoid.create({
    tag: 'hadron-iframe-handler', // This has to be unique per js loaded on the page
    url: 'hadron.app.html'
  })

var inControl;
window.inControl = inControl = new Hadron("inControl", "#hadron-container");
inControl.runControl();
