const { Command } = require('darabok');
const fs = require('fs-extra');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'setup',
            description: 'Set the system up!',
            ownerOnly: false,
            guildOnly: true,
            enabled: true,
            cooldown: 0,
            aliases: [],
            botPermissions: ["SEND_MESSAGES"],
            usage: ''
        })
    }

    async run(message, args) {
        const data = await fs.readJSON('./src/db/data.json');
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send('Only a person who can manage this server can set up the system.');
        if (data.enabled) {
            const answer = await this.ask(message, 'It looks like the system is already set up! Do you want to continue and overwrite the old configuration?');
            if (['no', 'n'].includes(answer.content.toLowerCase())) return message.channel.send('Understood... Cancelling!');
            if (['yes', 'y'].includes(answer.content.toLowerCase())) {
                this.setup(message);
            } else return message.channel.send('Invalind response. Cancelling.');
        } else this.setup(message);
    }

    async setup(message) {
        let finalData = { enabled: true };

        const channel = await this.ask(message, "Let's start the process, shall we? Where would you like the mods to get the Mod Mail? (Please mention a channel!)");
        const ch = channel.mentions.channels.first();
        if (!channel || !ch) return message.channel.send("It looks like you haven't mentioned a channel! Cancelling the operation...");
        if (!ch.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.channel.send(`I'm sorry, but I can't send messages to ${ch}! Cancelling...`);
        finalData.channel = channel.mentions.channels.first().id;

        const role = await this.ask(message, "Thanks! Now, please write down the name of the role that can reply to the Mod Mails!");
        if (!role || role.content.length <= 1) return message.channel.send("It looks like you didn't specify a role. Cancelling...");

        const gRole = message.guild.roles.find(r => r.name.toLowerCase() === role.content.toLowerCase());
        if (!gRole) return message.channel.send("It looks like the role you mentioned does not exist on the server! Cancelling...")
        finalData.role = gRole.id;

        const final = await this.ask(message, 'Great! This is all I need, confirm settings?');
        if (['no', 'n'].includes(final.content.toLowerCase())) return message.channel.send('Understood... Cancelling!');
        if (['yes', 'y'].includes(final.content.toLowerCase())) {
            const msg = await message.channel.send('Understood! Writing configuration...');
            await fs.writeJSON('./src/db/data.json', finalData);
            msg.edit('Configuration written! Good luck! :)')
        }
    }

    async ask(message, question) {
        return new Promise(async (resolve, reject) => {
            await message.channel.send(question);
            const collected = await message.channel.awaitMessages(m => m.author === message.author, { max: 1, time: 0 });
            if (collected.first()) resolve(collected.first());
            else reject();
        })
    }
}