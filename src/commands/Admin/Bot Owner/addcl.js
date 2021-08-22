const { Command } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['addchangelog'],
            description: 'Posts a changelog in the changelog channel on the support server.',
            flagSupport: false,
            permissionLevel: 9,
            requiredPermissions: ['EMBED_LINKS'],
            usage: '<Content:string>'
        });
    }

    async run(msg, ...params) {
        this.container.client.channels.cache.get(this.container.client.settings.changelogs).send({
            embed: new MessageEmbed()
                .setTitle(`<a:updating:417233654545383424> ${this.container.client.user.username}'s Changelog`)
                .setDescription(params)
                .setTimestamp()
        });
        msg.send(`${this.container.client.constants.EMOTES.tick}  ::  Successfully posted changelog!`);
    }

};
