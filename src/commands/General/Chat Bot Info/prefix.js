const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			runIn: ['text'],
			description: 'Changes the bot prefix server-wide.',
			usage: '[Prefix:string]'
		});
	}

	async run(msg, [newPrefix]) {
		const prefix = msg.guild.settings.get('prefix');
		if (!newPrefix) throw `The prefix for this server is currently \`${prefix}\`. Please use \`${prefix}prefix <prefix>\` to change the server prefix.`;
		if (!await msg.hasAtLeastPermissionLevel(6)) throw '<:error:508595005481549846>  ::  Sorry! Only moderators or people with Manage Server permission may change the server prefix.'; // eslint-disable-line max-len
		msg.guild.settings.update('prefix', newPrefix);
		msg.send(`<:check:508594899117932544>  ::  The prefix for **${msg.guild.name}** is now \`${newPrefix}\`. Type \`${this.client.user.tag}\` to get the current prefix.`);
	}

};
