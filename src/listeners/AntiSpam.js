const { Listener, Events } = require('@sapphire/framework');

module.exports = class extends Listener {

    constructor(...args) {
        super(...args, { event: Events.MessageCreate });
    }

    async run(msg) {
        if (!msg.guild) return null;
        if (!this.client.gateways.guilds.get(msg.guild.id).automod.antiSpam) return null;
        if (await msg.hasAtLeastPermissionLevel(6) && this.client.gateways.guilds.get(msg.guild.id).automod.ignoreMods) return null;
        if (this.client.gateways.guilds.get(msg.guild.id).automod.filterIgnore.antiSpam.includes(msg.channel.id)) return null;
        if (msg.author.equals(this.client.user)) return null;

        if (this.client.cache.members.get(msg.member.id).messages.length <= this.client.gateways.guilds.get(msg.guild.id).automod.options.antiSpam.limit) return null;
        if (msg.channel.postable) msg.channel.send(`Hey ${msg.author}! No spamming allowed, or I'll punish you!`);
        if (msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) this.client.cache.members.get(msg.member.id).messages.forEach(message => message.delete().catch(() => null));

        const { duration, action } = this.client.gateways.guilds.get(msg.guild.id).automod.options.antiSpam;
        const actionDuration = duration ? await this.client.arguments.get('time').run(`${duration}m`, '', msg) : null;
        switch (action) {
            case 'warn': return this.client.emit('modlogAction', {
                command: this.client.commands.get('warn'),
                channel: msg.channel,
                guild: msg.guild,
                content: msg.content
            }, msg.author, 'Spamming with AntiSpam enabled', null);
            case 'kick': return this.client.commands.get('kick').run(msg, [msg.author, ['Spamming with AntiSpam enabled']]).catch(err => msg.send(err));
            case 'mute': return this.client.commands.get('mute').run(msg, [msg.member, actionDuration, 'Spamming with AntiSpam enabled'], true).catch(err => msg.send(err));
            case 'ban': return this.client.commands.get('ban').run(msg, [msg.author, null, actionDuration, ['Spamming with AntiSpam enabled']], true).catch(err => msg.send(err));
            case 'softban': return this.client.commands.get('softban').run(msg, [msg.author, null, ['Spamming with AntiSpam enabled']]).catch(err => msg.send(err));
        }
        return msg;
    }

};
