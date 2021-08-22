const { Listener, Events } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Listener {

    constructor(...args) {
        super(...args, { event: Events.GuildCreate });
    }

    async run(guild) {
        const message = new MessageEmbed()
            .setColor('#C62A29')
            .setAuthor('Thank you for having me!', await guild.members.fetch(guild.ownerID).then(owner => owner.user.displayAvatarURL({ dynamic: true })))
            .setTitle(guild.name)
            .setFooter(`${this.container.client.user.username} Added!`, this.container.client.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(guild.iconURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setDescription([
                `Hey there ${guild.owner}! Thank you for having me in **${guild.name}**. It is an honor to serve you.`,
                `\nTo get started, please use \`${this.container.client.gateways.guilds.get(guild.id).prefix}help\` here or on any text channel. You will be given a list of commands.`,
                `Please feel free to look at the command list. If you want me to serve more Discord users, just use the \`${this.container.client.gateways.guilds.get(guild.id).prefix}invite\` command!`,
                '\nI can play music, moderate users, search lyrics, search Steam, search a lot more other stuff, and more!',
                `Most users use the music feature. Run \`${this.container.client.gateways.guilds.get(guild.id).prefix}help music\` and \`${this.container.client.gateways.guilds.get(guild.id).prefix}help play\` for more information!`,
                `\nBy **${this.container.client.application.owner.members.map(tm => tm.user.tag).join(', ')}**, from 🇵🇭 with ❤`
            ].join('\n'));
        const postableChannel = guild.channels.cache.filter(ch => ch.type === 'text' && ch.postable && ch.permissionsFor(guild.me).has('EMBED_LINKS')).first();
        if (!postableChannel) return guild.owner.user.sendEmbed(message).catch(() => null);
        return postableChannel.sendEmbed(message);
    }

};
