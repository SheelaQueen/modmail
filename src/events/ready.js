const { Event } = require('darabok');
const fs = require('fs-extra');

module.exports = class extends Event {
    constructor(client) {
        super(client);
        this.name = 'ready';
    }

    async run() {
        console.log('[Bot] Ready!');
        console.log(`[Bot] Connected as: ${this.client.user.tag}.`);
        if (this.client.guilds.size >= 2) console.log("[Warning] The bot is on more than one server! It was never intented to be used on more than one!")

        const db = await fs.pathExists('./src/db/data.json');
        const modlogs = await fs.pathExists('./src/db/modlogs.json');
        if (!db) {
            console.log("[Warning] Configuration file not found... Creating one!");
            await fs.createFile('./src/db/data.json');
            await fs.outputJSON('./src/db/data.json', {});
            console.log('[File] Configuration file successfully created.')
        }
        if (!modlogs) {
            await fs.createFile('./src/db/modlogs.json');
            await fs.outputJSON('./src/db/modlogs.json', {});
        }
    }
}