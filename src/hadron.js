/*jshint esversion: 6 */

/*
 These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
 Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

import './css/input.css';
import './css/reply.css';
import './css/says.css';
import './css/setup.css';
import './css/sprites.css';
import './css/typing.css';
import './css/materialize.min.css';

import './javascript/zepto.min.js';
import './javascript/fx.js';
import './javascript/fx_methods.js';
import './javascript/detect.js';

import Artyom from './javascript/artyom.js';
import './javascript/materialize.min.js';

import Config from './config.example.js';

class Hadron {
  constructor(self, target, options) {
      options = typeof(options) !== "undefined" ? options : {};

  		this.name = self;

      this.hadronButton = $(target).first();

      //  These are internal vars
      this.botHasSpoken = false;  // This is set to true if the bot is meant to talk first and HAS responded.
      this.token = false;
      this.soundObject = false;
      this.replyCount = 0;
      this.relative_path = Config.all_your_bases_are_belong_to_us;
      this.iceBreaker = false;  // this variable holds answer to whether this is the initative bot interaction or not
      this.quarkQueue = false;
      this._convo = false;
      this.standingAnswer = "ice";
      this.prereqsLoaded = false;
      this.fullyLoaded = false;
      this.stopCommand = "stop listening";
      this.userDictation = false;
      this.ttsURIToCall = "";

      //zepto controls AND this.hadronButton. These may act oddly because of the wrapping.
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
      this.doNotTrackText = "I see you have <b>Do Not Track</b> enabled.  This chat respects your request but we can't vouch for the site it is on.";

      // Controlled by data parameters. Double check readme names, defaults, etc.
      this.animationTime      = this.getControlData("bot-animation-speed", 150); // how long it takes to animate chat quarks, also set in CSS
      this.typeSpeed          = this.getControlData("bot-type-speed", 10); // delay per character, to simulate the machine "typing"
      this.botAMAText         = this.getControlData("bot-placeholder", "Ask me anything...");
      this.botWelcomeText     = this.getControlData("bot-welcome", "Say Hello or Hi to start chatting");
      this.rootFlowUUID       = this.getControlData("bot-user-data", "");
      this.chromeless         = this.getControlData("bot-without-chrome", false, "bool");
      this.MTOneBaseUrl       = this.getControlData("bot-mtone-uri", Config.mtone_base_uri);
      this.botUserData        = this.getControlData("bot-user-data-json", "");

      this.botTalksFirst      = this.getControlData("bot-talks-first", false, "bool");

      this.botResetOnLoad     = this.getControlData("bot-reset-on-load", false, "bool");

      this.ttsVisible         = this.getControlData("bot-tts-visible", true, "bool");
      this.ttsEnabled         = this.getControlData("bot-tts-enabled", false, "bool");

      this.recoVisible        = this.getControlData("bot-voice-recognition-visible", true, "bool");
      this.recoEnabled        = this.getControlData("bot-voice-recognition-enabled", false, "bool");
      this.recoContinuous     = this.getControlData("bot-voice-recognition-continuous", true, "bool");

      this.hideInput          = this.getControlData("bot-hide-input", false, "bool");
      this.use3DAvatar        = this.getControlData("bot-uses-3d-avatar", false, "bool");
      this.botId              = this.getControlData("bot-id", Config.api_key);
      this.widerBy            = this.getControlData("bot-wider-by", 32); // add a little extra width to quarks to make sure they don't break
      this.sidePadding        = this.getControlData("bot-side-padding", 6); // padding on both sides of chat quarks
      this.recallInteractions = this.getControlData("bot-recall-interactions", 0); // number of interactions to be remembered and brought back upon restart
      this.buttonClass        = this.getControlData("bot-button-class", "botanic-button");
      this.botSaysClass       = this.getControlData("bot-button-class", "botanic-green");
      this.botReplyClass      = this.getControlData("bot-reply-class", "botanic-silver");
      this.showDebug          = this.getControlData("bot-show-debug", true, "bool");
      this.useFlowText        = this.getControlData("bot-use-flow-text", false, "bool");
      this.botIcon            = this.getControlData("bot-icon", ""); // this.relative_path + "css/images/hadron-48.png");
      this.showSentiment      = this.getControlData("bot-show-sentiment", false, "bool");
      this.isSecure           = this.getControlData("bot-is-secure", false, "bool");

      this.showRefresh        = this.getControlData("bot-show-refresh", true, "bool");
      this.useLocalTTS        = this.getControlData("bot-local-tts", false, "bool");
      this.sizeClass          = this.getControlData("bot-size-class",   "standard");
      this.togglePulses       = this.getControlData("bot-toggle-pulses", true, "bool");
      this.toggleClass        = this.getControlData("bot-toggle-class", "botanic-green");
      this.toggleVisible      = this.getControlData("bot-toggle-visible", true, "bool");
      this.toggleIcon         = this.getControlData("bot-toggle-icon", "chat_bubble_outline");
      this.botTitle           = this.getControlData("bot-title", "Powered by Botanic");
      this.botSubTitle        = this.getControlData("bot-subtitle", "Powered by Botanic Technologies");
      this.closeClass         = this.getControlData("bot-close-class", "transparent");
      this.refreshClass       = this.getControlData("bot-refresh-class", "transparent");
      this.closeIcon          = this.getControlData("bot-close-icon", "expand_more");
      this.fullscreen         = this.getControlData("bot-fullscreen", false, "bool");
      this.startFullscreen    = this.getControlData("bot-start-fullscreen", false, "bool");

      this.externalCSS        = this.getControlData("bot-external-css", "");
      this.externalFont       = this.getControlData("bot-load-font", "");

      this.localStorageAvailable = this.localStorageCheck() && this.recallInteractions > 0;
      this.interactionsLS = "chat-quark-interactions";
      this.tokenLS = "chat-quark-token-" + this.rootFlowUUID + "-" + this.botId + "-" + Config.also_known_as;
      this.interactionsHistory = (this.localStorageAvailable && JSON.parse(localStorage.getItem(this.interactionsLS))) || [];
      this.sentimentToIcoName = [ 'sentiment_very_dissatisfied', 'sentiment_very_dissatisfied', 'sentiment_dissatisfied', 'sentiment_dissatisfied', 'sentiment_dissatisfied', 'sentiment_neutral', 'sentiment_satisfied', 'sentiment_satisfied', 'sentiment_satisfied', 'sentiment_very_satisfied', 'sentiment_very_satisfied'];

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

      // Make sure to create or use or update the JSON structure.
      if (this.botUserData == "") {
        this.botUserData = '{"botAuthorsToolDomain": "' + Config.author_tool_domain + '"}';
      }

      var bud = JSON.parse(this.botUserData);

      if (this.isUndefined(bud.botAuthorsToolDomain)) {
        bud.botAuthorsToolDomain = Config.author_tool_domain;
      }

      this.botUserData = JSON.stringify(bud);

      this.priorityInitialization();
      this.loadPrerequsites();
  	}

    showConfigState() {
      this.consoleLog("TTS Visible: " + this.ttsVisible);
      this.consoleLog("TTS Enabled: " + this.ttsEnabled);

      this.consoleLog("Reco Visible: " + this.recoVisible);
      this.consoleLog("Reco Enabled: " + this.recoEnabled);
      this.consoleLog("Reco Continuous: " + this.recoContinuous);

      this.ttsVisible         = this.getControlData("bot-tts-visible", true, "bool");
      this.ttsEnabled         = this.getControlData("bot-tts-enabled", false, "bool");

      this.recoVisible        = this.getControlData("bot-voice-recognition-visible", true, "bool");
      this.recoEnabled        = this.getControlData("bot-voice-recognition-enabled", false, "bool");
      this.recoContinuous     = this.getControlData("bot-voice-recognition-continuous", true, "bool");

    }

    // This gets the process started based on the config values.
    runControl() {
      this.initializeChatWindow();
    }

    // Do some pre-run tests.
    priorityInitialization() {
      this.getDeviceHint();

      // If the server isn't secure, don't bother enabling voice reco because it won't work.
      if (this.isSecure == false) {
        this.recoVisible = false;
      }

      // Mobile devices require local TTS for now.
      if (this.isMobile == true) {
        this.useLocalTTS = true;
      }
    }

    // Reads data elements from a control, applies a format and tests.
    getControlData(field, defaultValue = false, dataType = "string") {
      var foundData = this.hadronButton.data(field);

      foundData = this.urldecode(foundData);

      if (this.isUndefined(foundData)) {
        foundData = defaultValue;
      }

      if (dataType == "bool") {
        foundData = this.checkBoolean(foundData);
      }

      return foundData;
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

    // is local storage available?
    localStorageCheck() {
      var test = "chat-quark-storage-test";
      try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (error) {
        console.error(
          "Your server does not allow storing data locally. Most likely it's because you've opened this page from your hard-drive. For testing you can disable your browser's security or start a localhost environment."
        );
        return false;
      }
    }

    // Create a class name based loosely on device
    getDeviceHint() {
      this.isMobile = false;

      if ($.os.phone == true) {
        this.disableTray = false;
        this.recoEnabled = false;
        this.recoVisible = false;
        this.ttsEnabled = false;
        this.isMobile = true;

        return "quark-phone";
      } else if ($.os.tablet == true) {
        this.disableTray = false;
        this.isMobile = true;
        this.recoEnabled = false;
        this.recoVisible = false;
        this.ttsEnabled = false;

        return "quark-tablet";
      } else {
        this.disableTray = false;
        this.isMobile = false;

        return "quark-desktop";
      }
    }

    // Custom stylesheet from user.
    getStylesheet() {
      if (this.externalCSS != "") {
        if (this.externalCSS.indexOf('https://') === 0) {
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

      if (this.externalFont != "") {
        this.appendFont(this.externalFont);
      }

      this.prereqsLoaded = true;
    }

    // The core initializer for the chat
    initializeChatWindow() {
      if (this.hadronButton) {
        this.hadronButton.hide();

        var deviceHint = this.getDeviceHint();

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
            dashicons.append('<a id="hadron-refresh" title="Refresh" class="z-depth-1 btn-floating btn hadron-refresh hadron-toggle-2 ' + this.refreshClass + ' hadron-toggle"><i class="material-icons">refresh</i></a>');
          }

          dashicons.append('<a id="hadron-toggle-2" title="Close" class="z-depth-1 btn-floating btn hadron-toggle-2 ' + this.closeClass + ' hadron-toggle"><i class="material-icons">' + this.closeIcon + '</i></a>');

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
            parent.postMessage("MinimizeIframe", "*");
          });

          if (this.showRefresh == true) {
            $("#hadron-refresh").click(() => {
              inControl.refreshContol();
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

        if (this.hideInput == false) {
          this.typeInput();
        }

        if (this.chrome != false) {
          this.chrome.css({ opacity: 0.0 });
          this.chrome.anim({ opacity: 1.0 }, 0.5, 'ease-out');
        }

        this.fullyLoaded = true;

        this.mediaView(this.mediaViewEnabled);

        this.refreshContol();

        // recall previous interactions
        for (var i = 0; i < this.interactionsHistory.length; i++) {
          this.addQuark(this.interactionsHistory[i].say, function() {}, this.interactionsHistory[i].reply, false);
        }
      }
    }

    // Tests the token to ensure it is still valid.
    testToken(callback) {
      inControl.token = this.tokenRead();

      if (inControl.token == "") {
        callback();

        return;
      }

      var uri = inControl.MTOneBaseUrl + "auth/gndn/?token=" + inControl.token;

      $.ajax({url: uri,
          type: 'get',
          dataType: 'JSON',
          context: this,
          success: function(result){
            var json_obj = JSON.parse(result);

            if (json_obj.response.information.code  <= 202) {
              callback();
            } else {
                inControl.token = "";
                inControl.tokenSave("");
                callback();
            }
          }
      });
    }

    refreshContolInner() {
      if (this.botTalksFirst == true) {
        setTimeout(() => {
          var responseText = this.callMTOne("solongfarewellaufwiedersehen", function(botSaid, cards) {

          });
        }, 20);
      } else {
        setTimeout(() => {
          var responseText = this.callMTOne(":reset", function(botSaid, cards) {
            inControl.talk(false);
          });
        }, 20);
      }
    }

    // Reloads the control. Respects botTalksFirst flag
    refreshContol() {
      this.mediaView(false);

      inControl.quarkWrap.html('');
      inControl.quarkWrap.append(this.quarkTyping);

      inControl.testToken(() => {
        var animationDelay = this.animationTime * this.typeSpeed;
        if (inControl.doNotTrack) {
          var convo = { ice: { says: [inControl.doNotTrackText], reply: [] } };
          inControl.talk(convo);

          setTimeout(() => {
            inControl.refreshContolInner();
          }, animationDelay);
        } else {
          inControl.refreshContolInner();
        }
      });
    }

    // Toggle logging to clean up output
    consoleLog(text) {
      if (this.showDebug == true) {
        console.log(text);
      }
    }

    // prepare next save point
    interactionsSave(say, reply) {
      if (this.localStorageAvailable == false) {
        return;
      }

      // limit number of saves
      if (this.interactionsHistory.length > this.recallInteractions)
        this.interactionsHistory.shift(); // removes the oldest (first) save to make space

      // do not memorize buttons; only user input gets memorized:
      if (say.includes("quark-button") && reply !== "reply reply-freeform" && reply !== "reply reply-pick") {
        return;
      }

      // save to memory
      this.interactionsHistory.push({ say: say, reply: reply });
    }

    // commit save to localStorage
    interactionsSaveCommit() {
      if (!this.localStorageAvailable) return;
      localStorage.setItem(this.interactionsLS, JSON.stringify(this.interactionsHistory));
    }

    // read token from local storage
    tokenRead() {
      if (this.localStorageCheck() == false) {
        return "";
      } else {
        var token = localStorage.getItem(this.tokenLS) || "";

        if (token == "undefined") {
          token = "";
        }

        if (this.isUndefined(token)) {
          return "";
        } else {
          return token;
        }
      }
    }

    // save the token to local storage
    tokenSave(token) {
      if (this.localStorageCheck == false) {
        return;
      } else {
        localStorage.setItem(this.tokenLS, token);
      }
    }

    // Creates and handles user input.
    typeInput() {
      var ttsIcon;
      var recoIcon;
      var imageClass;

      var inputWrap = $('<div>', {class: 'input-wrap'});
      this.inputText = $('<textarea>', {placeholder: this.botAMAText});

      if (this.disableTray == false) {
        var recoContainer = $('<div>', {class: 'quark-reco-container'});

        if (this.recoVisible) {
          if (this.recoEnabled) {
            imageClass = 'quark-reco-button-on';

            M.toast({html: 'I\'m listening.', classes: 'rounded'});

            // Start reco.
            this.startReco(true);
          } else {
            imageClass = 'quark-reco-button-off';
          }
        } else {
          imageClass = 'quark-reco-button-disabled';
        }

        recoIcon = $('<img>', {id: 'quark-reco-icon', class: imageClass, src: 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=='});
        recoIcon.click(function() {
          if (inControl.recoVisible) {
            if ($(this).hasClass('quark-reco-button-on')) {
              // A click absolutely disables reco.
              inControl.returnToReco = false;

              inControl.stopReco();
            } else {
              inControl.startReco(true);
            }
          }
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
          imageClass = 'quark-tts-button-disabled';
        }

        ttsIcon = $('<img>', {class: imageClass, src: 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=='});
        ttsIcon.click(function() {
          if (inControl.ttsVisible) {
            if ($(this).hasClass('quark-tts-button-on')) {
              $(this).removeClass('quark-tts-button-on');
              $(this).addClass('quark-tts-button-off');

              inControl.ttsEnabled = false;
            } else {
              $(this).removeClass('quark-tts-button-off');
              $(this).addClass('quark-tts-button-on');

              inControl.ttsEnabled = true;
            }
          }
        });

        ttsContainer.append(ttsIcon);
        inputWrap.append(ttsContainer);
      }

      inputWrap.append(this.inputText);

      //JEM The inside is a mess.  Need to make it more zepto friendly.
      this.inputText.keypress((e) => {
        if (e.keyCode == 13) {
          e.preventDefault();

          var userSaid = this.inputText.val();

          if (this.isStopListeningCommand(userSaid)) {
            return;
          }

          typeof(this.quarkQueue) !== false ? clearTimeout(this.quarkQueue) : false; // allow user to interrupt the bot

          var lastQuark = $(".quark.say");
          lastQuark = lastQuark[lastQuark.length - 1];
          $(lastQuark).hasClass("reply") && !$(lastQuark).hasClass("reply-freeform") ? $(lastQuark).addClass("quark-hidden") : false;

          var styledUserInput = this.inputText.val();
          var sentimentPlaceholder = "";

          if (this.showSentiment) {
            sentimentPlaceholder = '<span class="quark-sentiment-placeholder">&nbsp;</span>';
          }

          if (inControl.hideButtonsWhenClicked) {
            $('.quark-button-wrap').hide();
          }

          this.addQuark(
            sentimentPlaceholder + '<span class="quark-user-input quark-pick right-align ' + this.botSaysClass + '">' + styledUserInput + "</span>",
            function() {},
            "reply reply-freeform"
          );

          // call MTOne after a slight delay.  MTOne can answer so quickly that it breaks behavior.
          // var userSaid = this.inputText.val();
          setTimeout(() => {
            var responseText = this.callMTOne(userSaid, function(botSaid, cards) {

            });
          }, 200);

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

  // Start the recognizer
  startReco(showToast) {
    if (this.recoObject == false) {
      this.recoObject = new Artyom();

      if (this.recoObject.recognizingSupported == false) {
        inControl.recoEnabled = false;
        return;
      }
    }

    if (showToast) {
      M.toast({html: 'I\'m listening.', classes: 'rounded', displayLength: 1000});
    }

    inControl.recoEnabled = true;

    if (inControl.recoContinuous == true) {
      inControl.returnToReco = true;
    } else {
      inControl.returnToReco = false;
    }

    if (this.recoEnabled == true) {
      $('#quark-reco-icon').removeClass('quark-reco-button-off');
      $('#quark-reco-icon').addClass('quark-reco-button-on');

      if (this.recoContinuous == true) {
        this.returnToReco = true;
      }

      this.recoObject.initialize({
        lang: "en-US",
        debug: false, // Show what recognizes in the Console
        listen: true, // Start listening after this
        speed: 0.9, // Talk a little bit slow
        mode: "normal", // This parameter is not required as it will be normal by default
        continuous: true//,
        //name: "Jarvis"
      });

      var settings = {
          continuous:true, // Don't stop never because i have https connection
          onResult:function(interimText, temporalText, isFinal) {
              // Show the Recognized text in the console
              //console.log("Recognized text: ", text);

              if (!isFinal) {
                inControl.inputText.val(interimText);
              } else {
                inControl.recoInput(temporalText);

                inControl.stopReco();
              }

          },
          onStart:function(){
              //console.log("Dictation started by the user");
          },
          onEnd:function(){
              //alert("Dictation stopped by the user");
          }
      };

      this.userDictation = this.recoObject.newDictation(settings);
      this.userDictation.start();
    }
  }

  // Stop the recognizer.
  stopReco() {
    if (this.recoEnabled == true) {
      $('#quark-reco-icon').removeClass('quark-reco-button-on');
      $('#quark-reco-icon').addClass('quark-reco-button-off');

      inControl.recoEnabled = false;

      if (this.userDictation) {
        this.userDictation.stop();
        this.userDictation = false;
      }
    }
  }

  // Make the reco speak, mobile devices need this.
  localTTS(phrase, language = "en-US") {
    if (language == "") {
      language = "en-US";
    }

    if (inControl.recoObject == false) {
      inControl.recoObject = new Artyom();
      inControl.recoObject.initialize({
        lang: language,
        debug: true, // Show what recognizes in the Console
        listen: true, // Start listening after this
        speed: 0.9, // Talk a little bit slow
        mode: "normal", // This parameter is not required as it will be normal by default
        continuous: true,
        name: "Jarvis"
      });
    }

    inControl.recoObject.say(phrase, {
      onStart:function(){
      },
      onEnd:function(){
        if (inControl.returnToReco == true) {
          setTimeout(function(){
            inControl.startReco(false);
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
    var areEqual = this.caseInsensitiveCompare(phrase, this.stopCommand);

    if (areEqual) {
      M.toast({html: 'I am no longer listening.', classes: 'rounded', displayLength: 1000});

      this.inputText.val('');
      this.stopReco();
      return true;
    }

    return false;
  }

  // Receives the spoken text, sends to chat input.
  recoInput(phrase) {
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
      if (this.hideInput == true) {
        convo = { ice: { says: [this.botWelcomeText], reply: [{ question: "Hi!", answer: "hi", type: "echo"}] } };
      } else {
        convo = { ice: { says: [this.botWelcomeText], reply: [] } };
      }
    }

    // all further .talk() calls will append the conversation with additional blocks defined in convo parameter
    this._convo = Object.assign(this._convo, convo); // POLYFILL REQUIRED FOR OLDER BROWSERS

    this.reply(this._convo[here]);
    here ? (this.standingAnswer = here) : false;
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
          var clickEvent = 'window.inControl.answer("' + el.answer + '", "' + el.question + '", "' + el.type + '");';
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

    this.orderQuarks(turn.says, () => {
      this.quarkTyping.removeClass("imagine");
      questionsHTML !== "" ? this.addQuark(questionsHTML, function() {}, "says-buttons") : this.quarkTyping.addClass("imagine");
    });
  }

  // This receives the info from MTOne both text and card array
  processResponse(botSaid, cards) {
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
        var botSaidAfter = this.parseBotResponse(botSaid[index].speech);

        messageObject = { message: botSaidAfter, unadorned: false};
        messages.push(messageObject);
      }
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
    } else {
      this.mediaView(false);
    }

    if (this.mediaViewEnabled == true) {
      this.ttsURIToCall = "";
    }

    if (this.ttsURIToCall) {
      this.handleTTS(this.ttsURIToCall);
    }

    //convo = { ice: { says: [botWelcomeText], reply: [] } }
    var conv = { ice: { says: messages, reply: buttons.reverse() } };
    this.talk(conv);

    $('#mediaplayer').on('ended', function() {
      console.log('ended');
      if (inControl.returnToReco == true) {
        console.log('recoResume');
        setTimeout(function(){
          inControl.startReco(false);
        }, 200);
      }
    });

    if (this.threedVisualizerID != false) {
    }
  }

  // Look for a trigger phrase.
  parseBotResponse(botSaid) {
    if (botSaid.includes("HADRONSTARTVOICERECO")) {
      botSaid = botSaid.replace("HADRONSTARTVOICERECO", "");
      inControl.recoEnabled = true;
      inControl.returnToReco = true;
    }

    if (botSaid.includes("HADRONSTOPVOICERECO")) {
      botSaid = botSaid.replace("HADRONSTOPVOICERECO", "");
      inControl.stopReco();
    }

    if (botSaid.includes("HADRONBREAK1")) {
      botSaid = botSaid.replace("HADRONBREAK1", "");
    }

    if (botSaid.includes("HADRONBREAK2")) {
      botSaid = botSaid.replace("HADRONBREAK2", "");
    }

    return botSaid;
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

    if (video.endsWith('fullscreen') || inControl.mediaViewEnabled) {
      media  = '<video id="mediaplayer" class="responsive-video" poster="' + image + '" autoplay>';
    } else {
      media  = '<video id="mediaplayer" class="responsive-video" poster="' + image + '" autoplay controls controlsList="nodownload">';
    }

    var mediaType = "video/mp4";

    if(video.indexOf("//www.youtube") !== -1) {
      // YouTube embedding.
      mediaType = "video/youtube";
      media = '<iframe class="responsive-video" src="' + video + '" frameborder="0" allowfullscreen></iframe>';

      console.log('URL passed the test');
    } else if(video.indexOf("//vimeo") !== -1) {
      // Vimeo embed.
      mediaType = "video/vimeo";
      media = '<iframe src="' + video + '" class="responsive-video" frameborder="0"></iframe>';

      console.log('URL passed the test');
    } else {
      // Native...
      media += '<source src="' + video + '" type="' + mediaType + '">';
      media += '</video>';
    }

    var message = { message: media, unadorned: true};

    return message;
  }

  // Make a call to MTOne to do the TTS.  Could also speak locally in some cases but this allows for a custom voice.
  handleTTS(uri) {
    if (uri == false) {
        return;
    }

    $.ajax({url: uri,
        type: 'get',
        dataType: 'JSON',
        context: this,
        success: function(result){
          var json_obj = JSON.parse(result);

          var sound_uri = json_obj.response.data[0].audio_uri || false;

          if (sound_uri != false) {
            this.stopReco();
            this.playAudio(sound_uri);
          }
        }
    });
  }

  // Plays an audio file and stops an existing audio file.  Used by TTS, make be used by receiving an audio card.
  playAudio(url) {
    if (this.soundObject != false) {
      this.soundObject.pause();
    }

    this.showConfigState();

    this.soundObject = new Audio(url);
    this.soundObject.play();
    this.consoleLog(url);

    // If it was off, keep it off! JEM
    // If there is a pause, no voice detected for a few seconds, turn off all reco.
    // If the user clicks the stop, it stops.
    // If the user says "stop listening" or something similar, it stops.
    this.soundObject.onended = function() {
      if (inControl.returnToReco == true) {
        setTimeout(function(){
          inControl.startReco(false);
        }, 200);
      }
    };
  }

  // Calls MTOne to get chat response based on user input.
  callMTOne(text, callback) {
    var uri = "";
    var that = this;

    this.token = this.tokenRead();

    uri = this.MTOneBaseUrl + "social/chatbot/?service=chatbot_router&uid=" + this.botId + "&type=text&handler=text&text=" + encodeURIComponent(text) + "&user_data_json=" + encodeURI(this.botUserData);
    if (this.token !== "") {
      uri += "&token=" + this.token;
    }

    if (this.rootFlowUUID !== "") {
      uri += "&user_data=" + this.rootFlowUUID;
    }

    $.ajax({url: uri,
        type: 'get',
        dataType: 'JSON',
        context: this,
        success: function(result){
          var json_obj = JSON.parse(result);

          if (inControl.isUndefined(json_obj.token) == false) {
            this.tokenSave(json_obj.token);
          }

          this.ttsURIToCall = "";

          if (this.ttsEnabled == true) {
            // If we are in mediaView we do NOT use TTS. Eventually should be only if the media is video but for now.
            if (this.useLocalTTS == false) {
              this.ttsURIToCall = json_obj.tts || false;
            } else {
              this.localTTS(json_obj.bot_said || "");
            }
          }

          this.processSentiment(json_obj.sentimentValue);

          this.processResponse(json_obj.messages, json_obj.cards);

          callback(json_obj.messages, json_obj.cards);
    }});
  }

  // Displays sentiment if enabled.
  processSentiment(sentimentValue) {
    if (this.showSentiment == true) {
      var sentimentString = this.sentimentToIcoName[sentimentValue + 5];
      var sentimentals = $('.quark-sentiment-placeholder');

      if (sentimentals.length > 0) {
        var sentimentStringToInsert = '<i class="material-icons right-align">' + sentimentString + '</i>';
        $(sentimentals[0]).removeClass('quark-sentiment-placeholder');
        $(sentimentals[0]).addClass('quark-sentiment-shown');
        $(sentimentals[0]).append(sentimentStringToInsert);
      }
    }
  }


  // Enable/disable media view mode.  In media view mode an overlay holds the media object, is stationary and has a one line element to display the last user test.
  mediaView(state) {
    this.mediaViewEnabled = state;

    // Create the overlay components and assign them so other functions can interact with it.
    if (state == true) {
      if ($('.quark-media-content').length != 0) {
        return;
      }

      // Disable TTS, it would be bad over a video preso.
      this.ttsEnabled = false;

      this.mediaViewPreservedState = this.container;

      this.mediaOverlay = $('<div>', {class: "quark-media-overlay"});
      this.mediaOverlayContent = $('<div>', {class: "quark-media-content"});

      this.mediaOverlay.append(this.mediaOverlayContent);

      this.container.append(this.mediaOverlay);
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
    if (inControl.hideButtonsWhenClicked) {
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
      var responseText = this.callMTOne(key, function(botSaid, cards) {
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
        start = function() {
          inControl.addQuark(q[index], callback);
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
            //JEM This hides the buttons that were not chosen.
            if (inControl.hideButtonsWhenClicked) {
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
      wait < minTypingWait ? (wait = minTypingWait) : false;
      setTimeout(() => {
        this.quarkTyping.removeClass("imagine");
      }, animationTime);
    }

    live && setTimeout(() => { this.quarkTyping.addClass("imagine"); }, wait - animationTime * 2);

    this.quarkQueue = setTimeout(() => {
      this.quark.removeClass("imagine");

      var quarkWidthCalc = (this.quarkContent[0].offsetWidth * 1) + this.widerBy;

      if (quarkWidthCalc <= this.widerBy) {
        quarkWidthCalc = 360 * 0.4;
      }

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
      posted();

      // save the interaction
      this.interactionsSave(say, reply);
      !this.iceBreaker && this.interactionsSaveCommit(); // save point

      // animate scrolling
      var containerHeight = this.container[0].offsetHeight;
      var scrollDifference = this.quarkWrap[0].scrollHeight - this.quarkWrap[0].scrollTop;
      var scrollHop = (scrollDifference) / 200;

      if (scrollHop > 3) {
        scrollHop = scrollHop * 3;
      }

      var scrollQuarks = () => {
        for (var i = 1; i <= scrollDifference / scrollHop; i++) {
          ;(function() {
            setTimeout(() => {
              if ((inControl.quarkWrap[0].scrollHeight - inControl.quarkWrap[0].scrollTop) > containerHeight) {
                var sTop = inControl.quarkWrap[0].scrollTop + scrollHop;
                inControl.quarkWrap[0].scrollTop = sTop;

                inControl.consoleLog(containerHeight + ", " + inControl.quarkWrap[0].scrollHeight + ", " + inControl.quarkWrap[0].scrollTop);
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
}

var inControl;

function allJSClassesLoaded() {
  window.inControl = inControl = new Hadron("inControl", ".hadron-button");
  inControl.runControl();

  window.onload = function() {
    function receiveMessage(e) {
      if (e.data == "refreshHadron") {
        inControl.refreshContol();
      }
    }

    window.addEventListener('message', receiveMessage);
  };
}

allJSClassesLoaded();
