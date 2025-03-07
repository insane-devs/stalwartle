const { Command, CommandOptionsRunTypeEnum, container } = require('@sapphire/framework');
const { reply } = container;

module.exports = class extends Command {

    constructor(context, options) {
        super(context, {
            ...options,
            preconditions: ['ModsOnly'],
            runIn: [CommandOptionsRunTypeEnum.GuildText],
            description: 'Warns a mentioned user.'
        });
        this.usage = '<Member:member> [Reason:...string]';
    }

    async messageRun(msg, args) {
        const member = await args.pick('member').catch(() => null);
        if (member === null) return reply(msg, `${this.container.constants.EMOTES.xmark}  ::  Please supply the member to be warned.`);
        const reason = await args.rest('string').catch(() => null);

        if (member.user.id === msg.author.id) return reply(msg, 'Why would you warn yourself?');
        if (member.user.id === this.container.client.user.id) return reply(msg, 'Have I done something wrong?');

        reply(msg, `${this.container.constants.EMOTES.tick}  ::  **${member.user.tag}** (\`${member.id}\`) has been warned.${reason ? ` **Reason**: ${reason}` : ''}`);
        return this.container.client.emit('modlogAction', 'warn', msg.author, member.user, msg.guild, { channel: msg.channel, reason });
    }

};
