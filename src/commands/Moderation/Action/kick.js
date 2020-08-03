const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['KICK_MEMBERS'],
			runIn: ['text'],
			description: 'Kicks a mentioned user.',
			usage: '<Member:member> [Reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		if (member.user.equals(msg.author)) throw 'Why would you kick yourself?';
		if (member.user.equals(this.client.user)) throw 'Have I done something wrong?';
		if (member.user.equals(msg.guild.owner.user)) throw 'Pretty sure the server owner cannot be kicked...';

		if (msg.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) throw `${this.client.constants.EMOTES.xmark}  ::  You cannot kick this user.`;
		if (!member.kickable) throw `${this.client.constants.EMOTES.xmark}  ::  I cannot kick this user.`;

		reason = reason.length ? reason.join(this.usageDelim) : null;
		await member.kick(reason);
		msg.channel.send(`${this.client.constants.EMOTES.tick}  ::  **${member.user.tag}** (\`${member.id}\`) has been kicked.${reason ? ` **Reason**: ${reason}` : ''}`);
		return this.client.emit('modlogAction', msg, member.user, reason);
	}

};
