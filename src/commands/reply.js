const { Command } = require('darabok');
const fs = require('fs-extra');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'reply',
            description: 'Reply to an users question!',
            ownerOnly: false,
            guildOnly: true,
            enabled: true,
            cooldown: 0,
            aliases: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            usage: '[case number] [answer]'
        })
    }

    async run(message, args) {
        const data = await fs.readJSON('./src/db/data.json');
        let modlogs = await fs.readJSON('./src/db/modlogs.json');

        const role = message.guild.roles.get(data.role);
        if (!message.member.roles.has(role.id)) return message.channel.send("You're not allowed to do this action!");

        const [caseNumber, ...answer] = args;

        if (!caseNumber || isNaN(caseNumber)) return message.channel.send("You must mention which case log you want to reply to! (must be a number)")
        if (!modlogs[caseNumber]) return message.channel.send("There isn't a case with this number!");
        if (answer.join(' ').length <= 1) return message.channel.send('Invalid answer!');

        modlogs[caseNumber].answer = answer.join(' ');
        modlogs[caseNumber].answerer = message.author.id;

        const questioner = this.client.users.get(modlogs[caseNumber].questioner);
        await fs.writeJSON('./src/db/modlogs.json', modlogs);

        await questioner.send(`You got a reply for Case #${caseNumber}: ${answer.join(' ')}`);
        message.channel.send('The reply has been sent!');
    }
}