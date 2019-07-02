
## Botanic/SEED Hadron
Standalone Web Chat Client for use with Botanic/SEED Token Network services.  

### Disclaimer
These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
Seed Vault Code (c) Botanic Technologies, Inc. Used under license.

### What is Hadron
Hadron is a presentation wrapper for deploying bots in a container that can be included in a variety of website frameworks. It includes voice recognition, text to speech and 3D avatar capabilities.

### Install Hadron
```
npm install
```

### Run development instance (hotloading enabled)

This will open a browser with Hadron calling bot id 5d1627422047fc0006614969 on url http://localhost:5000/restful_channel:

```
BBOT_ID=5d1627422047fc0006614969 BBOT_URL=http://localhost:5000/restful_channel npm run dev
```

### Load Hadron (online production build) 
```
    <span class="hadron-button quark"
        data-bot-show-debug="true"
        data-bot-uses-3d-avatar="false"
        data-bot-size-class="fullscreen"
        data-bot-placeholder=""
        data-bot-talks-first="true"
        data-bot-welcome="Hi!"
        data-bot-reset-on-load="true"
        data-bot-subtitle=""
        data-bot-recall-interactions="false"
        data-bot-title="Avataracious BETA"
        data-bot-voice-recognition-visible="true"
        data-bot-voice-recognition-continuous="true"        
        data-bot-load-font="Montserrat:300,400,600"        
        data-bot-external-css=""
        data-bot-launcher-external-css="s"
        data-bot-track-anonymous-user-id="false"
        data-bot-bbot-uri="http://domain:port/restful_channel"
        data-bot-id="5d132a422057fc0076714969"
    ></span>        
    <script type="text/javascript" src="app.bundle.js"></script>

```

### Live Demo of Hadron (SEED Bot)
Hadron has been implemented as a FAQ Bot on the [Seed Token website](https://seedtoken.io) and on Telegram (search for @seedtokenbot)

### Test Hadron on Codepen
https://codepen.io/BotanicTechnologies/pen/WarGxm

### Introduction
Part of the SEED token project. This is a sneak preview - there is more to come.
See [the Wiki](https://github.com/SeedVault/SEEDtoken-IP/wiki) for more information.

### About the SEED Token Project
SEED democratizes AI by offering an open and independent alternative to the monopolies of a few large corporations that currently control conversational user interfaces (CUIs) and AI technologies. SEED's licensed, monetized open-source platform for bots on blockchain supports collaboration and creative compensation that will exceed the proprietary deployments from industry giants. We are also giving users back control of their personal data. Find out more about the SEED Token project at [seedtoken.io](https://seedtoken.io). See the Connect section at the end for contact info.

### How to contribute - how to get involved
Go to our **[Developers Garden](https://developers.seedtoken.io)** to see all featured projects, pick one and fill out the **[Developer Interest Form](https://developers.seedtoken.io/#Developer-Interest-Form)**. If you rather like to discuss ideas before rolling up your sleeves, please come visit our **[Discord channels for developers](https://discord.gg/Suv5bFT)**

### Features

- [x] Basic text
- [x] Inline HTML formatting
- [x] Remote CSS inclusion to enhance styles
- [x] Buttons
- [x] Buttons that open links in a separate tab
- [x] Embedded video
- [x] Does not require or need Bot Framework or Skype support
- [x] Frame/frameless options
- [x] Chat button that expands to chat window
- [x] Support different orientations and sizes
- [x] Embedded audio
- [x] Basic card support
- [x] Hadron cards
- [ ] Support for mobile devices
- [ ] Video recording
- [ ] 3D Avatar support
- [ ] Accessibility
- [ ] Allow the client to say what is on the screen and say the name of a button that was clicked
- [ ] Image alt tag support for accessibility
- [ ] Make text input optional, some bots may be UI driven

### Settings

#### data-bot-animation-speed
###### Default = 150

Animation duration in milliseconds.  Used for some CSS animations like bubbles appearing/disappearing.  


#### data-bot-type-speed
###### Default = 10

Typing delay, a multiple of the animation speed. Real delay (ms) = data-bot-type-speed x data-bot-animation-speed.

#### data-bot-placeholder
###### Default = "Ask me anything..."

The text displayed in the text input when there is no user text present.

#### data-bot-welcome
###### default = "Say Hi or Hello to start chatting"

A prompt to the user when the control opens.

#### data-bot-user-data
###### Default = ""

Sends a flow ID to the server to specify a flow created by MVP

#### data-bot-without-chrome
###### Default = "false"

Presents a frameless, chromeless chat window.  e.g., no outer frame, no title bar, no avatar.  A basic chat window.

#### data-bot-user-data-json
###### Default ""

Used to deliver JSON data from the control to bot server.

#### data-bot-talks-first
###### Default false

If set to true, the bot will send a message to the user without the user having initiated a conversation.


#### data-bot-reset-on-load
###### Default "false"

If true, the user state is cleared and conversations start from the beginning whenever a user returns to the site.

#### data-bot-tts-enabled
###### Default "false"

Enables text to speech for bot responses.


#### data-bot-tts-visible
###### Default "true"

Shows the TTS button in the input bar if set to true and supported by the device.  

#### data-bot-voice-recognition-visible
###### Default "true"

Shows the voice recognition button when set to true and supported by the device.

#### data-bot-voice-recognition-enabled
#### Default "false"

When true, voice recognition is on and receiving input from a user.

#### data-bot-voice-recognition-continuous
###### Default "false"

When true, recognition is on until speech has finished.  The text is sent to the bot and when the bot has replied, recognition is enabled again.

#### data-bata-hide-input
###### Default "false"

If true, the input bar is removed and all UI interactions must be made with buttons.

#### data-bot-uses-3d-avatar
###### Default "false"

If true, loads the 3D system up front to make the presentation more responsive.


#### data-bot-id
###### No default

The API key used to access the chat server.

#### data-bot-wider-by
###### Default 32

Widens chat bubbles to accommodate for oddities in fonts, etc.

#### data-bot-side-padding
###### Default 6

Padding for chat bubbles

#### data-bot-recall-interactions
###### Default 0

Set to a number that represents the number of past conversations that are stored.  Has not been tested.

#### data-bot-button-class
###### Default "botanic-green"

A predefined CSS class for user chat bubbles.  The default is botanic-green however it can also be any of the materializecss color strings.

#### data-bot-reply-class
###### Default "botanic-silver"

A predefined CSS class for user chat bubbles.  The default is botanic-silver however it can also be any of the materializecss color strings.

#### bot-show-debug
###### Default false

If enabled, some debug info is sent to the javascript console for test purposes.

#### data-bot-icon
###### Default ""

An icon to show in the top right of chat control.

#### data-bot-show-sentiment
###### Default "false"

When true, the user sentiment is displayed beside user input.

#### data-bot-show-refresh
###### Default "true"

Shows a refresh button in the top bar, resets the user state when clicked.

#### data-bot-local-tts
###### Default "false"

When true, the browser does text to speech.  

#### data-bot-size-class
###### Default "standard"

Sets the size of the chat window.  Possible values are standard, fullscreen, fullestscreen and tall.


#### data-bot-toggle-pulses
###### Defaut "true"

When true, the launcher icon pulses to draw attention.

#### data-bot-toggle-icon
###### Default "chat_bubble_outline"

An icon for the launcher.

#### data-bot-title
###### Default ""

Defines the title for the chat window.


#### data-bot-subtitle
###### Default ""

Defines the subtitle for the chat window.  If subtitle is empty, the top bar changes to display just the title line.

#### data-bot-close-icon
###### Default ""

The icon class for the close button.

#### data-bot-external-css
###### Default ""

Defines an external CSS file that can override styles in Hadron.  The CSS file must be served from a secure domain!

#### data-bot-external-css
###### Default ""

Applies a stylesheet to Hadron.  Must be served from HTTPS.

#### data-bot-launcher-external-css
###### Default ""

Applies a stylesheet to the Hadron launcher.  Must be served from HTTPS.

#### data-bot-load-font
###### Default ""

Loads a font from Google into Hadron.
