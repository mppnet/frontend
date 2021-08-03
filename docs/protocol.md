#mppclone.com Protocol

##Message Format
All messages sent by the client and the server are JSON arrays. Socket messages are strings, not binary. Each array can contain one or more individual message objects. Each individual message object has a "m" property where its value is a string signaling which message type it is.
####Example socket message:
[{"m":"hi","token":"abcdef"}]

##Referenced concepts
###Colors
All colors are hexadecimal strings.
####Example
"#ff8ff9"
###Times
All times are UNIX timestamps (number). All times that are sent and received by clients are the server's time. Clients adjust the times they send and receive to ensure it lines up with the server's time. It figures out how much to adjust by using "t" messages.
####Example
1627968429598

###String validation
For most messages that get sent to other clients, strings are checked to make sure they don't cause issues. Strings following string validation must not include any of the following characters:
- \n
- \r
- \v
- \0
- \t
- \u202e
- \u2066
- \u2067
- \u202b
- \u200f
Strings following string validation cannot be made entirely of spaces, and cannot be empty.

###Participant info
In some messages, the server will send a participant info object instead of an id.
####Properties
- "id": The user's id (string).
- "\_id": The user's id (string). This is identical to the above field but is sent to keep backwards compatibility.
- "name": The user's name.
- "color": The user's color.
- "x": The user's mouse x coordinate (number). This is usually between 0-100 for standard clients, but can be any number if set with scripts. 0 is on the left edge, 100 is on the right edge.
- "y": The user's mouse y coordinate (number). This is usually between 0-100 for standard clients, but can be any number if set with scripts. 0 is on the top edge, 100 is on the bottom edge.
- ?"tag": Optional tag (string). This is usually either "BOT", "MOD", "ADMIN", or "OWNER", but could be any string. If this property is not present, the user does not have a tag.
- ?"vanished": Whether the user is vanished (boolean). Regular users and bots will never see this property, however moderators will receive this if they or another user are vanished. If this property is not present, the user is not vanished.
Mouse will start as (200, 100) for users who haven't sent a mouse position.
####Example
{
  "\_id":"514df042c61528f566530313",
  "id":"514df042c61528f566530313",
  "name":"Lapis",
  "color":"#ff8ff9",
  "tag":"OWNER",
  "x":50,
  "y":50
}

###Channel settings
Channel settings are an object with properties for each setting.
####Properties
- "visible": Whether the channel is visible to normal users in the channel list (boolean).
- "color": The channel's inner background color.
- ?"color2": The channel's outer background color.
- "chat": Whether chat is enabled in this channel (boolean).
- ?"no cussing": Whether no cussing is enabled (boolean). If this is enabled, some things in chat will get replaced with asterisks for users who don't have the crown. If this property isn't present, "no cussing" is disabled.
- "limit": The maximum amount of users that can join this channel (number). This is an integer between 0-99. If this is lowered while more users are in the channel, users won't get kicked. The crown holder and users who already have a participant in the channel bypass this limit.
- ?"minOnlineTime": The minimum amount of time that a user needs to have been online to join this channel (number). It's measured in milliseconds. If this field is not present, the restriction does not apply. If a user holds the crown in this channel or if they already have a participant in the channel, they bypass this restriction.
- ?"lobby": Whether the channel is a lobby (boolean). Clients cannot change this property. If this property is not present, the channel is not a lobby.
####Example
{
  "lobby":true,
  "limit":20,
  "color":"#73b3cc",
  "color2":"#273546",
  "visible":true,
  "chat":true
}

###Crown
This is an object containing information about the crown in that channel.
####Properties
- "userId": The user id who has the crown (string).
- ?"participantId": This field is either identical to "userId" or it is not present (string). If this field is not present, the crown is dropped. If it is present, the crown is held.
- "time": The time at which the crown was dropped (number). If the crown is not dropped, this value can be ignored.
- "startPos": An object containing an "x" and "y" property with coordinates (numbers) where the crown's animation should start.
- "endPos": An object containing an "x" and "y" property with coordinates (numbers) where the crown's animation should finish.
####Example
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

##Client -> Server Messages

###A
"a" messages are sent by the client whenever the client chats. The sending client must be in a channel to use this message.
####Properties
- "a": String to send in chat for everyone in your channel. Must be less than 512 characters and must follow string validation.
###Bye
A "bye" message can be sent to close the client's socket. No more messages will be handled after the server receives "bye". Standard browser clients don't send this.
###Ch
A "ch" message can be sent to attempt to change the client's channel. If the specified channel does not exist, it will be created.
####Properties
- "\_id": Channel name. Must be less than 512 characters and must follow string validation.
- ?"set": Optional settings to initialize the channel with if it doesn't exist. See channel settings. 
