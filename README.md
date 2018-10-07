# ModMail Bot!

A bot for Discord that allows users to DM the bot to contact the server's moderator team. The DMs get send to a channel, which every mod can see. Mods can then reply to these inquiries, and the responses are relayed back to the original user as a DM.

## Setup

1. Install the latest LTS version of [Node.JS](https://nodejs.org)

2. Clone or download this repository.

3. Create a channel on your Discord server (this will receive the inquiries)

4. Make a copy of config.example.json (in the same folder) and name it config.json. Open the file and fill in the values required.

5. Install the dependencies (`npm install`)

6. Run the bot using `npm start`

7. Add the bot to your server and use [prefix]setup to set it up.

## Commands

[prefix]reply - Reply to an users inquiry!
[prefix]setup - Set the system up!

### Configuration Legend

token - The bots token, used to login to the Discord API!

prefix - The prefix the bot is going to use!

ownerID - the ID of the bots owner, used for eval.

##### Please note that the bot is currently in __beta__! 