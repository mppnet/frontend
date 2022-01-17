# mppclone.com Protocol

## Navigation
- [Websocket Information](#websocket-information)
  - [Connecting](#connecting)
  - [Messages](#messages)
  - [Close Reasons](#close-reasons)
- [Important Concepts](#important-concepts)
  - [Colors](#colors)
  - [Times](#times)
  - [String validation](#string-validation)
  - [Participant info](#participant-info)
  - [Channel info](#channel-info)
  - [Channel settings](#channel-settings)
  - [Crown](#crown)
  - [Target](#target)
  - [Note](#note)
  - [Tag](#tag)
  - [Login](#login)
  - [Account Info](#account-info)
- [Client -> Server Messages](#client---server-messages)
  - [A](#a-server-bound)
  - [Bye](#bye-server-bound)
  - [Ch](#ch-server-bound)
  - [Chown](#chown)
  - [Chset](#chset)
  - [Custom](#custom-server-bound)
  - [Devices](#devices)
  - [Dm](#dm-server-bound)
  - [Hi](#hi-server-bound)
  - [Kickban](#kickban)
  - [M](#m-server-bound)
  - [-custom](#-custom)
  - [-ls](#-ls)
  - [n](#n-server-bound)
  - [+custom](#custom)
  - [+ls](#ls)
  - [T](#t-server-bound)
  - [Unban](#unban)
  - [Userset](#userset)
- [Server -> Client Messages](#server---client-messages)
  - [A](#a-client-bound)
  - [B](#b)
  - [Bye](#bye-client-bound)
  - [C](#c)
  - [Ch](#ch-client-bound)
  - [Custom](#custom-client-bound)
  - [Dm](#dm-client-bound)
  - [Hi](#hi-client-bound)
  - [Ls](#ls-1)
  - [M](#m-client-bound)
  - [N](#n-client-bound)
  - [Notification](#notification)
  - [Nq](#nq)
  - [P](#p)
  - [T](#t-client-bound)

## Websocket Information
### Connecting
The websocket server is on (wss://mppclone.com:8443). Any non-websocket requests to that port will be rejected.
### Messages
All messages sent by the client and the server are JSON arrays. Socket messages are strings, not binary. Each array can contain one or more individual message objects. Each individual message object has a "m" property where its value is a string signaling which message type it is.
#### Example socket message:
```json
[{"m":"hi","token":"abcdef"}]
```
### Close Reasons
#### HTTP Response Codes
- `400 Bad Request`: A non-websocket connection was made to the websocket port.
- `429 Too Many Requests`: Too many clients tried to connect from the same IP address in a short period of time. Slow down connection rates, and make sure handshakes aren't failing.
#### Websocket Close Codes
All websocket close codes have a code (number) and a reason (string).
- `4000` - `Server closing.`: The server is closing, probably due to an update. Reconnect in a few seconds.
- `4001` - `Too many unique users per IP per hour.`: Each IP address can only use 3 unique non-bot tokens per hour. This is to discourage people from using so-called "proxy tokens" which let them evade mutes or bans without actually using a proxy.
- `4002` - `Exceeded x bytes per y seconds.`: There is a cap on how much data clients can send in a given period. This quota may change later, and the owner can manually increase it. Make sure you aren't sending extremely large messages.
- `4003` - `Message buffer length exceeded x.`: Internally, the server buffers messages so that things always get done in the right order, even if a message runs asynchronous code. Clients can hit this limit if they send too many messages too quickly, or if the server has an error. Errors in the server are rare and shouldn't happen. The owner is able to see if one happened.
- `4004` - `Timed out.`: Clients must send [t](#t-server-bound) messages every 20 seconds. They will get kicked if it has been longer than 30 seconds since the last time sync message was received. Time sync messages will not work before [hi](#hi-server-bound) has been sent.
- `4007` - `Exceeded x messages per y seconds.`: There is a cap on how many individual message objects can be sent in a period of time. If this cap is exceeded the socket is closed.
- `4008` - `Banned.`: The user is banned from the server. A notification should show a reason and amount of time remaining.
- `4009` - `Client limit reached.`: There is a limit on how many clients can be connected at a time per user. Contact the owner if you need to connect more clients.
- Between `4500` and `4999` - `Another client caused your IP to hit volation limit. Your IP is temporarily banned. Last violation reason: x`: A different client on the same IP address received a violation. Your IP hit the volation quota and that caused a temporary IP address ban. Subtract 500 from the code to see the original violation code.

## Important concepts
### Colors
All colors are hexadecimal strings.
#### Example
```js
"#ff8ff9"
```
### Times
All times are UNIX timestamps (number). All times that are sent and received by clients are the server's time. Clients adjust the times they send and receive to ensure it lines up with the server's time. It figures out how much to adjust by using "t" messages.
#### Example
```js
1627968429598
```

### String validation
For most messages that get sent to other clients, strings are checked to make sure they don't cause issues. Strings following string validation cannot be made entirely of spaces, and cannot be empty. Strings following string validation must not include any of the following characters:
- `\n`
- `\r`
- `\v`
- `\0`
- `\t`
- `\u202e`
- `\u2066`
- `\u2067`
- `\u202b`
- `\u200f`

### Participant info
In some messages, the server will send a participant info object instead of an id.
#### Properties
- `"id"`: The user's id (string).
- `"_id"`: The user's id (string). This is identical to the above field but is sent to keep backwards compatibility.
- `"name"`: The user's name.
- `"color"`: The user's color.
- `"x"`: The user's mouse x coordinate (string or number). This is usually between 0-100 for standard clients, but can be any number if set with scripts. 0 is on the left edge, 100 is on the right edge. Default value is 200 until set by the user.
- `"y"`: The user's mouse y coordinate (string or number). This is usually between 0-100 for standard clients, but can be any number if set with scripts. 0 is on the top edge, 100 is on the bottom edge. Default value is 100 until set by the user.
- `?"tag"`: The user's [Tag](#tag) object.
- `?"vanished"`: Whether the user is vanished (boolean). Regular users and bots will never see this property, however moderators will receive this if they or another user are vanished. If this property is not present, the user is not vanished.
#### Example
```json
{
  "_id":"514df042c61528f566530313",
  "id":"514df042c61528f566530313",
  "name":"Lapis",
  "color":"#ff8ff9",
  "tag":{
    "text":"OWNER",
    "color":"#a00"
  },
  "x":50,
  "y":50
}
```

### Channel info
Contains information about a channel.
#### Properties
- `"count"`: The number of users currently in the channel.
- `"id"`: The name of this channel.
- `"_id"`: The name of this channel. Identical to `"id"`.
- `?"crown"`: The [crown](#crown) in this channel. This property is not present in lobbies because lobbies don't have crowns.
- `"settings"`: This channel's [settings](#channel-settings).
#### Example
```json
{
  "settings": {
    "chat": true,
    "color": "#440c09",
    "visible": true,
    "limit": "50",
    "crownsolo": false,
    "no cussing": false,
    "minOnlineTime": 3600000,
    "color2": "#000000"
  },
  "_id": "✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧",
  "id": "✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧",
  "count": 16,
  "crown": {
    "endPos": {
      "x": 90,
      "y": 74.7223883077421
    },
    "startPos": {
      "x": 200,
      "y": 100
    },
    "userId": "b40df99cc2ca6f503fba77cb",
    "time": 1627974260906,
    "participantId": "b40df99cc2ca6f503fba77cb"
  }
}
```

### Channel settings
Channel settings are an object with properties for each setting.
#### Properties
- `"visible"`: Whether the channel is visible to normal users in the channel list (boolean).
- `"color"`: The channel's inner background color.
- `?"color2"`: The channel's outer background color.
- `"chat"`: Whether chat is enabled in this channel (boolean).
- `"crownsolo"`: Whether anyone can play the piano (boolean). If this is false, only the crown holder can play the piano.
- `?"no cussing"`: Whether no cussing is enabled (boolean). If this is enabled, some things in chat will get replaced with asterisks for users who don't have the crown. If this property isn't present, "no cussing" is disabled.
- `"limit"`: The maximum amount of users that can join this channel (number). This is an integer between 0-99. If this is lowered while more users are in the channel, users won't get kicked. The crown holder and users who already have a participant in the channel bypass this limit.
- `?"minOnlineTime"`: The minimum amount of time that a user needs to have been online to join this channel (number). It's measured in milliseconds and is between 0 and 86400000. If this field is not present, the restriction does not apply. If a user holds the crown in this channel or if they already have a participant in the channel, they bypass this restriction.
- `?"lobby"`: Whether the channel is a lobby (boolean). Clients cannot change this property. If this property is not present, the channel is not a lobby.
#### Example
```json
{
  "lobby":true,
  "limit":20,
  "color":"#73b3cc",
  "color2":"#273546",
  "visible":true,
  "chat":true,
  "crownsolo":false
}
```

### Crown
This is an object containing information about the crown in that channel.
#### Properties
- `"userId"`: The user id who has the crown (string).
- `?"participantId"`: This field is either identical to "userId" or it is not present (string). If this field is not present, the crown is dropped. If it is present, the crown is held.
- `"time"`: The time at which the crown was dropped (number). If the crown is not dropped, this value can be ignored.
- `"startPos"`: An object containing an "x" and "y" property with coordinates (numbers) where the crown's animation should start.
- `"endPos"`: An object containing an "x" and "y" property with coordinates (numbers) where the crown's animation should finish.
#### Example
```json
{
  "userId":"b40df99cc2ca6f503fba77cb",
  "time":1627968456997,
  "startPos":{
    "x":75.8,
    "y":30.6
  },
  "endPos":{
    "x":75.8,
    "y":82.3
  }
}
```

### Target
This is an object describing who something should be sent to. Currently this is only used in "custom" messages. If mode is "subscribed", it targets everyone in the channel who is subscribed to custom messages. Clients can subscribe or unsubscribe with [+custom](#custom) and [-custom](#-custom) If mode is "id", it targets a single participant. If mode is "ids", it targets all of the listed participants. Targeting will **never** target the sender.
#### Properties
- `"mode"`: This can either be **"subscribed"**, **"id"**, or **"ids"**.
- `"id"`: If "mode" is "id", this is sent with a string user id.
- `"ids"`: If "mode" is "ids", this is sent with an array of user ids. The array cannot be longer than 32.
- `"global"`: Whether the message should be broadcasted outside of the channel (boolean). If false, the message is only sent to clients within a single channel.
#### Example
```json
{
  "mode":"ids",
  "ids":[
    "4d354eaddf02eedc6211034c",
    "fd4365210b7f25b6cb0ed683"
  ]
}
```

### Note
Notes can either be a note start, or a note stop. Note starts have a "v" property singaling the velocity of the note, and note stops have an "s" property with the value of 1. It's impossible for a note to have both "v" and "s".
#### Properties
- `"n"`: This is the name of the note (string). Run `Object.keys(MPP.piano.keys)` in console to see a list of possible values.
- `?"d"`: Delay from the message's time to trigger this note event (number). The delay is in milliseconds and should be no more than 200. If this property is not present, the delay is 0.
- `?"v"`: The velocity for this note if it's a note start (number). This is between 0 and 1 inclusive.
- `?"s"`: 1 if the note is a note stop.
#### Example
```json
{
  "n":"b2",
  "d":150,
  "v":0.32
}
```

### Tag
Tags are official and identify either approved bots or server staff. They have text and a color and are displayed next to someone's name.
#### Properties
- `"text"`: This is the text that will display on the tag (string).
- `"color"`: A hexadecimal color of the tag (string). This color may be shortened to 3 hexadecimal characters, with one for each component.
#### Example
```json
{
  "text":"BOT",
  "color":"#55f"
}
```

### Login
To login to an account, a user can send a login object in "hi". The server will check the information sent and assign them a different user ID based on it.
#### Properties
- `"type"`: The method to login with. Currently this can only be `"discord"`.
- `"code"`: The OAuth2 authorization code.
#### Example
```json
{
  "type":"discord",
  "code":"abcdefghijklmnopqrstuvwxyz"
}
```

### Account Info
Information about a user's account. This is displayed in clients so they can see who they are logged in as.
#### Properties
- `"type"`: The method the user logged in with. Currently this can only be `"discord"`.
- `"username"`: The user's Discord username (string).
- `"discriminator"`: The user's discriminator (string).
- `"avatar"`: The user's avatar URL (string).
#### Example
```json
{
  "type":"discord",
  "username":"NotARealUser",
  "discriminator":"0001",
  "avatar":"https://cdn.discordapp.com/avatars/926633278100877393/82dd16b896d6fce421532b0e8a4244f9.png"
}
```

## Client -> Server Messages

### A (server-bound)
"a" messages are sent to chat in the current channel.
#### Properties
- `"message"`: String to send in chat for everyone in your channel. Must be 512 characters or less and must follow [string validation](#string-validation).
#### Example
```json
{
  "m":"a",
  "message":"Hello :D"
}
```
### Bye (server-bound)
A "bye" message can be sent to close the client's socket. No more messages will be handled after the server receives "bye". Standard browser clients don't send this.
#### Example
```json
{
  "m":"bye"
}
```
### Ch (server-bound)
A "ch" message can be sent to attempt to change the client's channel. If the specified channel does not exist, it will be created.
#### Properties
- `"_id"`: Channel name. Must be less than 512 characters and must follow [string validation](#string-validation).
- `?"set"`: Optional settings to initialize the channel with if it doesn't exist. See channel settings. If a property isn't sent in this object, the server will use the default value.
#### Example
```json
{
  "m":"ch",
  "_id":"My new room",
  "set":{
    "visible":false
  }
}
```
### Chown
Clients can send chown messages to drop the crown or give it to someone else.
#### Properties
- `?"id"`: The user id who should receive the crown (string). If this property is not present or if the id is invalid, the participant will drop the crown.
#### Example
```json
{
  "m":"chown",
  "id":"f46132453478f0a8679e1584"
}
```
### Chset
Clients can send this to change a channel's settings if they have the crown.
#### Properties
- `"set"`: Channel settings to change. See channel settings. If a property isn't sent, it will stay as it is. The only exception is "color2" which gets deleted from the channel's settings if the property is not sent.
#### Example
```json
{
  "m":"chset",
  "set":{
    "color":"#0066ff",
    "color2":"#ff9900",
    "chat":"false"
  }
}
```
### Custom (server-bound)
Clients can send custom data using this message. This is meant for developers to create addons for multiple people without being restricted to the standard protocol. A user can only send 16384 bytes of custom data per 10 seconds. This is measured by the stringified value in the "data" property. If the "data" property is not present, it is treated as null. Make sure you have lots of type checking for receiving custom messages, because someone could craft a malicious message to try to break your scripts.
#### Properties
- `"data"`: Data to send to other clients. This can be any valid JSON. It could be an array, an object, a string, a number, or boolean, or null. Object nesting is acceptable to any depth (within the data quota).
- `"target"`: Object representing who this should get sent to. See [target](#target).
#### Example
```json
{
  "m":"custom",
  "data":{
    "xyz":"abc",
    "def":"ghi",
    "jkl":[
      "mno",
      123,
      456,
      null,
      "hi",
      {
        "idk":"lol"
      },
      true
    ]
  },
  "target": {
    "mode":"subscribed"
  }
}
```

### Devices
Browser clients send a list of connected midi inputs and outputs with this when the socket opens and whenever it changes. Bots don't need to send this.
#### Properties
- `"list"`: An array of device infos.
#### Example
```json
{
  "m":"devices",
  "list":[
    {
      "type": "input",
      "manufacturer": "",
      "name": "loopMIDI Port",
      "version": "1.0",
      "enabled": true,
      "volume": 1
    },
    {
      "type": "output",
      "manufacturer": "",
      "name": "OmniMIDI",
      "version": "14.5.1",
      "volume": 1
    }
  ]
}
```

### Dm (server-bound)
"dm" messages are sent to direct message another participant in the channel.
#### Properties
- `"message"`: String to send in chat to the target user. Must be 512 characters or less and must follow [string validation](#string-validation).
- `"_id"`: User id to send the message to (string).
#### Example
```json
{
  "m":"dm",
  "message":"hi there",
  "_id":"a8c86bb6e74c9ec8900e061a"
}
```

### Hi (server-bound)
A "hi" message is sent when the client first connects to the server. This must be sent before sending anything else (except [devices](#devices)).
#### Properties
- `?"token"`: A token to use (string). Valid tokens will assign the client a specific user when they join. If this property is not present, the client will get the default user for their IP address.
- `?"code"`: Response generated by the anti-bot system. Bots can ignore this, valid bot tokens will bypass the anti-bot system.
- `?"login"`: A [login](#login) object.
#### Example
```json
{
  "m":"hi",
  "token":"this is not a valid token",
  "login": {
    "type":"discord",
    "code":"abcdefghijklmnopqrstuvwxyz"
  }
}
```

### Kickban
This is sent to ban a user from the channel.
#### Properties
- `"_id"`: The user id to ban (string).
- `"ms"`: The amount of milliseconds to ban the user for. Between 0 and 3600000.
#### Example
```json
{
  "m":"kickban",
  "_id":"a4ea42f1d9770e671f938e8c",
  "ms":300000
}
```

### M (server-bound)
This is sent to move the participant's mouse.
#### Properties
- `"x"`: x position to move to (number). Can be any valid JSON number, even if it's out of the normal range.
- `"y"`: y position to move to (number). Can be any valid JSON number, even if it's out of the normal range.
#### Example
```json
{
  "m":"m",
  "x":25,
  "y":63.5
}
```

### -custom
This is sent to unsubscribe from custom messages sent with the "subscribed" target.
#### Example
```json
{
  "m":"-custom"
}
```

### -ls
This is sent to unsubscribe from channel list updates.
#### Example
```json
{
  "m":"-ls"
}
```

### N (server-bound)
This sends notes to other clients in the channel.
#### Properties
- `"t"`: The time at which the notes should play.
- `"n"`: An array of notes. See [note](#note).
#### Example
```json
{
  "m":"n",
  "t":1627971516894,
  "n":[
    {
      "n":"c3",
      "v":0.75
    },
    {
      "n":"c3",
      "d":100,
      "s":1
    }
  ]
}
```

### +custom
This is sent to subscribe to custom messages sent with the "subscribed" target.
#### Example
```json
{
  "m":"+custom"
}
```

### +ls
This is sent to subscribe to channel list updates.
#### Example
```json
{
  "m":"+ls"
}
```

### T (server-bound)
"t" is for pinging. This must be sent every 20 seconds, because the server will disconnect your client if it's not sent for more than 30 seconds.
#### Properties
- `?"e"`: The client's time.
#### Example
```json
{
  "m":"t",
  "e":1627972519126
}
```

### Unban
"unban" is sent to unban a user from the client's channel.
#### Properties
- `"_id"`: The user id to unban.
#### Example
```json
{
  "m":"unban",
  "_id":"0c49bea6c2a328101eee40b7"
}
```

### Userset
"userset" changes the name or color of the client's user.
#### Properties
- `"set"`: An object containing "name" and or "color" properties. "color" must be a valid color, and "name" must be 40 characters or less and fit [string validation](#string-validation).
#### Example
```json
{
  "m":"userset",
  "set":{
    "name":"Lapis",
    "color":"#ff8ff9"
  }
}
```

## Server -> Client Messages

### A (client-bound)
"a" messages are sent to every client in a room when someone chats.
#### Properties
- `"t"`: The server's time when it handled the chat message.
- `"a"`: The text sent in chat.
- `"p"`: Participant info of the user who sent the chat message.
#### Example
```json
{
  "m":"a",
  "t":1628015260531,
  "a":"test",
  "p":{
    "_id":"514df042c61528f566530313",
    "name":"Lapis",
    "color":"#ff8ff9",
    "tag":{
      "text":"OWNER",
      "color":"#a00"
    },
    "id":"514df042c61528f566530313"
  }
}
```

### B
A "b" message is sent immediately when a connection opens. It's used by the anti-bot system to keep bot spam out.
#### Properties
- `"code"`: A string used by the anti-bot system.
#### Example
```json
{
  "m":"b",
  "code":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
}
```

### Bye (client-bound)
A "bye" message is usually sent when a participant is removed from the client's channel. Sometimes participant removals are sent with [Ch](#ch-client-bound) messages instead.
#### Properties
- `"p"`: The id of the user who left.
#### Example
```json
{
  "m":"bye",
  "p":"64578b5417566bcd4fa2fdbb"
}
```

### C
A "c" message is sent whenever a client joins a channel, or when chat is cleared by moderators. It contains up to 32 messages of chat history for the current channel, including DMs.
#### Properties
- `"c"`: An array containing between 0 and 32 complete [A](#a-client-bound) or [Dm](#dm-client-bound) messages, including the `"m"` property.
#### Example
```json
{
  "m": "c",
  "c": [
    {
      "m": "a",
      "t": 1628017539781,
      "a": "Anonygold#9668: add stealwatches in k44 now",
      "p": {
        "_id": "141777bd0f408111c5fc7ad9",
        "name": "[discord.gg/k44Eqha]",
        "color": "#f140ae",
        "tag": {
          "text": "BOT",
          "color": "#55f"
        },
        "id": "141777bd0f408111c5fc7ad9"
      }
    },
    {
      "m": "a",
      "t": 1628017546207,
      "a": "Retroplateau#1995: and deathwatches",
      "p": {
        "_id": "141777bd0f408111c5fc7ad9",
        "name": "[discord.gg/k44Eqha]",
        "color": "#f140ae",
        "tag": {
          "text": "BOT",
          "color": "#55f"
        },
        "id": "141777bd0f408111c5fc7ad9"
      }
    },
    {
      "m": "a",
      "t": 1628017551011,
      "a": "Retroplateau#1995: and annoywatches",
      "p": {
        "_id": "141777bd0f408111c5fc7ad9",
        "name": "[discord.gg/k44Eqha]",
        "color": "#f140ae",
        "tag": {
          "text": "BOT",
          "color": "#55f"
        },
        "id": "141777bd0f408111c5fc7ad9"
      }
    },
    {
      "m": "a",
      "t": 1628017555817,
      "a": "Anonygold#9668: add anonywatches",
      "p": {
        "_id": "141777bd0f408111c5fc7ad9",
        "name": "[discord.gg/k44Eqha]",
        "color": "#f140ae",
        "tag": {
          "text": "BOT",
          "color": "#55f"
        },
        "id": "141777bd0f408111c5fc7ad9"
      }
    }
  ]
}
```

### Ch (client-bound)
This is sent with all the information about a channel. It's broadcasted to everyone in a channel whenever channel settings change, the crown is dropped or given to a user, or sometimes when a participant is added or removed. It's also sent to a client when they join a channel.
#### Properties
- `"p"`: The client's user id.
- `"ppl"`: An array of [participant info](#participant-info)s for every user in the channel.
- `"ch"`: A [channel info](#channel-info) object.
#### Example
```json
{
  "m": "ch",
  "ch": {
    "settings": {
      "chat": true,
      "color": "#440c09",
      "visible": true,
      "limit": "50",
      "crownsolo": false,
      "no cussing": false,
      "minOnlineTime": 3600000,
      "color2": "#000000"
    },
    "_id": "✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧",
    "id": "✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧",
    "count": 16,
    "crown": {
      "endPos": {
        "x": 90,
        "y": 74.7223883077421
      },
      "startPos": {
        "x": 200,
        "y": 100
      },
      "userId": "b40df99cc2ca6f503fba77cb",
      "time": 1627974260906,
      "participantId": "b40df99cc2ca6f503fba77cb"
    }
  },
  "ppl": [
    {
      "_id": "b40df99cc2ca6f503fba77cb",
      "name": "Bouncer [//help]",
      "color": "#2524a5",
      "tag": {
        "text": "BOT",
        "color": "#55f"
      },
      "id": "b40df99cc2ca6f503fba77cb",
      "x": 200,
      "y": 100
    },
    {
      "_id": "78a11a25c966d62d0231a135",
      "name": "Yoshino ( y!help )",
      "color": "#f97d87",
      "tag": {
        "text": "BOT",
        "color": "#55f"
      },
      "id": "78a11a25c966d62d0231a135",
      "x": 200,
      "y": 100
    },
    {
      "_id": "4d354eaddf02eedc6211034c",
      "name": "Theta [=help]",
      "color": "#e51c8d",
      "tag": {
        "text": "BOT",
        "color": "#55f"
      },
      "id": "4d354eaddf02eedc6211034c",
      "x": "86.20",
      "y": "76.40"
    }
  ],
  "p": "514df042c61528f566530313"
}
```

### Custom (client-bound)
This is sent when a client sends a [custom](#custom-server-bound) message.
#### Properties
- `"data"`: The data sent in this custom message. Can be any valid JSON.
- `"p"`: The user id of the client who sent this custom message.
#### Example
```json
{
  "m":"custom",
  "data":[
    "hi",
    "hello",
    "how are you"
  ],
  "p":"1dbe9eb24f0f4668cc72ac79"
}
```

### Dm (client-bound)
This is sent to the recipient when a client direct messages another participant.
#### Properties
- `"t"`: The server's time when the DM was handled.
- `"a"`: The message's text.
- `"sender"`: [Participant info](#participant-info) for the user who sent the DM.
- `"recipient"`: [Participant info](#participant-info) for the user who is receiving the DM. This will usually be a client's own participant, unless the user is a moderator and can see other user's DMs.
#### Example
```json
{
  "m": "dm",
  "t": 1628019628643,
  "a": "this direct message is going in the protocol documentation as an example",
  "sender": {
    "_id": "514df042c61528f566530313",
    "name": "Lapis",
    "color": "#ff8ff9",
    "tag": {
      "text": "OWNER",
      "color": "#a00"
    },
    "id": "514df042c61528f566530313"
  },
  "recipient": {
    "_id": "fd4365210b7f25b6cb0ed683",
    "name": "͏͏͏͏A͏͏͏n͏͏͏o͏͏n͏y͏͏͏͏g͏͏͏͏͏o͏l͏d͏͏",
    "color": "#ffd700",
    "id": "fd4365210b7f25b6cb0ed683"
  }
}
```

### Hi (client-bound)
This is sent as a response when the client first sends `"hi"`.
#### Properties
- `"t"`: The server's time when it handled the `"hi"` message.
- `"u"`: The client's [participant info](#participant-info) except without `"id"`.
- `"permissions"`: An object containing the client's permissions. This is usually empty and can be ignored by most bots. This is used to display buttons and other options for staff.
- `?"token"`: A string token that the client can send back in the future to keep the same user. This is only sent when it doesn't match the token the client sent. Bots should have their token hard coded and can ignore this.
- `"accountInfo"`: An [account info](#account-info) object.
#### Example
```json
{
  "m": "hi",
  "t": 1628019780663,
  "u": {
    "_id": "514df042c61528f566530313",
    "name": "Lapis",
    "color": "#ff8ff9",
    "tag": {
      "text": "OWNER",
      "color": "#a00"
    }
  },
  "token": "514df042c61528f566530313.9d26e1c7-1161-4621-8dc7-3f2c74fc661b",
  "permissions": {},
  "accountInfo": {
    "type":"discord",
    "username":"Lapis",
    "discriminator":"7110",
    "avatar":"https://cdn.discordapp.com/avatars/454060101104435200/f20a18fca27dd87eced3658117c530e9.png"
  }
}
```

### Ls
This is sent when a client subscribes to the channel list, or when a channel updates while they are subscribed.
#### Properties
- `"c"`: Whether this is a complete list of channels (boolean). If true, `"u"` is an array with every channel. If false, `"u"` is an array with channels to update information for.
- `"u"`: Array of [channel info](#channel-info)s.
#### Example
```json
{
  "m": "ls",
  "c": false,
  "u": [
    {
      "settings": {
        "chat": true,
        "color": "#800080",
        "color2": "#000000",
        "visible": true,
        "limit": 50,
        "crownsolo": false,
        "no cussing": false
      },
      "_id": "The Roleplay Room",
      "id": "The Roleplay Room",
      "count": 16,
      "crown": {
        "endPos": {
          "x": 90,
          "y": 82.31281739206041
        },
        "startPos": {
          "x": "99.95",
          "y": "0.70"
        },
        "userId": "b40df99cc2ca6f503fba77cb",
        "time": 1627974260906,
        "participantId": "b40df99cc2ca6f503fba77cb"
      }
    }
  ]
}
```

### M (client-bound)
This is broadcasted to every other client in a channel when a client sends a mouse movement.
#### Properties
- `"id"`: The user id of the participant who moved their mouse.
- `"x"`: The participant's new mouse x position (string).
- `"y"`: The participant's new mouse y position (string).
#### Example
```json
{
  "m": "m",
  "x": "50.30",
  "y": "26.49",
  "id": "c649910153f09f5087685ba2"
}
```

### N (client-bound)
This is broadcasted to every other client in a channel when a client sends notes.
#### Properties
- `"t"`: The base time of this message. Notes with `"d"` properties are offset from this time by their `"d"` value.
- `"p"`: The user id who sent the notes.
- `"n"`: An array of [notes](#note).
#### Example
```json
{
  "m": "n",
  "t": 1628020489306.2944,
  "n": [
    {
      "n": "a1",
      "s": 1
    },
    {
      "n": "e1",
      "s": 1,
      "d": 0
    },
    {
      "n": "a0",
      "s": 1,
      "d": 0
    },
    {
      "n": "a1",
      "v": 0.7874015748031497,
      "d": 0
    },
  ],
  "p": "514df042c61528f566530313"
}
```

### Notification
Notification messages are sent when someone gets kickbanned from the channel you're in, when you fail to join a room, or when your `"hi"` handshake fails. They can also be sent manually by the owner of the site.
#### Properties
- `?"duration"`: Milliseconds the notification should display for before fading out. Default is 30000.
- `?"class"`: The CSS class that the notification should use. Default is `"classic"`.
- `?"id"`: The ID that the notification should use in HTML. If this property is not present, it's given a random ID.
- `?"title"`: The title for the notification. Default is a blank string.
- `?"text"`: The inner text for the notification. Default is a blank string.
- `?"html"`: The inner html for the notification. Default is a blank string.
- `?"target"`: Where the notification should be displayed as a jQuery selector. Default is `"#piano"`.
#### Example
```json
{
  "m": "notification",
  "duration": 15000,
  "title": "Notice",
  "target": "#room",
  "text": "You already have the maximum amount of clients connected. Your id: 846e6d0900d96642bf8cb927"
}
```

### Nq
This is sent when a client joins a channel or when their note quota changes. This message describes the note quota that the client should abide by. You can find the Note Quota script [here](https://github.com/aeiou879/mppclone/blob/main/client/NoteQuota.js).
#### Properties
- `"allowance"`: The amount of note on or offs that a participant can send per 2 seconds consistently.
- `"max"`: The maximum amount of note on or offs that a participant can send per 6 seconds.
- `"maxHistLen"`: How many periods of 2 seconds should be buffered. This is always 3.
#### Example
```json
{
    "m": "nq",
    "maxHistLen": 3,
    "max": 1200,
    "allowance": 400
}
```

### P
A "p" message is usually sent when a participant is added from the client's channel. Sometimes participant additions sent with [Ch](#ch-client-bound) messages instead.
#### Properties
All of the properties for that user's [participant info](#participant-info).
#### Example
```json
{
  "m": "p",
  "_id": "f05631ee009fce4d53fb0c79",
  "name": "Anonymous",
  "color": "#c50116",
  "id": "f05631ee009fce4d53fb0c79",
  "x": 200,
  "y": 100
}
```

### T (client-bound)
This is sent in response to a client's ping message.
#### Properties
- `"t"`: The server's time when it received the client's ping.
- `?"e"`: An echo of the time the client sent with their ping message. If the client didn't send their time, this property won't be present.
#### Example
```json
{
    "m": "t",
    "t": 1628020444326,
    "e": 1628020443009
}
```
