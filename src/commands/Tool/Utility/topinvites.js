const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: [CommandOptionsRunTypeEnum.GuildText],
            aliases: ['ti'],
            requiredPermissions: ['MANAGE_GUILD'],
            description: 'Shows the top invites in a server.'
        });
    }

    async messageRun(msg) {
        const invites = await msg.guild.fetchInvites();
        const topTen = invites.filter(inv => inv.uses > 0).sort((a, b) => b.uses - a.uses).first(10);
        if (topTen.length === 0) throw 'There are no invites, or none of them have been used!';
        return msg.sendMessage(
            topTen.map((inv, top) => `\`${top + 1}\`. **${inv.inviter.username}**'s invite **${inv.code}** has **${inv.uses.toLocaleString()}** use${inv.uses > 1 ? 's' : ''}.`)
        );
    }

};
