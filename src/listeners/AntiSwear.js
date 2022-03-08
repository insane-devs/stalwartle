const { Listener, Events } = require('@sapphire/framework');

module.exports = class extends Listener {

    constructor(context, options) {
        super(context, { ...options, event: Events.MessageCreate });
    }

    async run(msg) {
        if (!msg.member) return null;
        if (!this.container.stores.get('gateways').get('guildGateway').get(msg.guild.id).automod.antiSwear) return null;
        if ((await this.container.stores.get('preconditions').get('ModsOnly').run(msg)).success && this.container.stores.get('gateways').get('guildGateway').get(msg.guild.id).automod.ignoreMods) return null;
        if (this.container.stores.get('gateways').get('guildGateway').get(msg.guild.id).automod.filterIgnore.antiSwear.includes(msg.channel.id)) return null;
        if (msg.author.equals(this.container.client.user)) return null;

        let swearArray = this.container.stores.get('gateways').get('guildGateway').get(msg.guild.id).automod.swearWords.map(word => `(?:^|\\W)${word}(?:$|\\W)`);
        if (this.container.stores.get('gateways').get('guildGateway').get(msg.guild.id).automod.globalSwears) swearArray = swearArray.concat(this.container.constants.SWEAR_WORDS_REGEX).map(word => `(?:^|\\W)${word}(?:$|\\W)`);
        const swearRegex = new RegExp(swearArray.join('|'), 'im');
        if (!swearArray.length || !swearRegex.test(msg.content)) return null;
        if (msg.channel.permissionsFor(this.container.client.user).has('SEND_MESSAGES')) msg.channel.send(`Hey ${msg.author}! No swearing allowed, or I'll punish you!`);
        if (msg.channel.permissionsFor(this.container.client.user).has('MANAGE_MESSAGES')) msg.delete();

        const { duration, action } = this.container.stores.get('gateways').get('guildGateway').get(msg.guild.id).automod.options.antiSwear;

        return this.container.client.emit('modlogAction', action, this.container.client.user, msg.author, msg.guild, {
            content: msg.content,
            channel: msg.channel,
            reason: 'Swearing with AntiSwear enabled',
            duration: Date.now() + (1000 * 60 * duration)
        });
    }

};
