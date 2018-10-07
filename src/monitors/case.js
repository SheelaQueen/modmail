const { Monitor } = require('darabok');
const { RichEmbed } = require('discord.js');
const fs = require('fs-extra');

module.exports = class extends Monitor {
    constructor(client) {
        super(client);
        this.name = 'case';
    }

    async run(message) {
        if (message.channel.type !== 'dm' || message.author.bot) return;
        
        const data = await fs.readJSON('./src/db/data.json');
        if (!data.enabled) return message.channel.send(`It seems like the system has not been set up yet! Ask a server administrator to set it up using ${this.client.prefix}setup!`);
        let modlogs = await fs.readJSON('./src/db/modlogs.json');
        let modlognumber = null;
        let last = Object.keys(modlogs).pop();
        if (!last) modlognumber = 1;
        else modlognumber = Number(last) + 1;
        modlogs[modlognumber] = { question: message.content, questioner: message.author.id, answer: null, answerer: null };
        await fs.writeJSON('./src/db/modlogs.json', modlogs);
        await this.announceMods(message, modlogs, data);
        return message.channel.send(`Your problem has been registered and is now awaiting moderator action! (Case #${modlognumber})`);
    }

    async announceMods(message, modlogs, data) {
        const channel = this.client.channels.get(data.channel);
        const modlognumber = Object.keys(modlogs).pop();
        const last = modlogs[modlognumber];
        const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setDescription(last.question)
        .setFooter(`Case #${modlognumber} | Please use ${this.client.prefix}reply ${modlognumber} [answer] to reply!`)
        .setColor('#66ccff')
        .setTimestamp();
        return channel.send(embed);
    }
}