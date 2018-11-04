const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 7,
			runIn: ['text'],
			description: 'Sets the automod settings for the server.',
			extendedHelp: [
				'All filters are disabled by default. If you want to enable the invite filter, use `s.automod invite enable`. Same for the swear, spam, and mentionspam filters.',
				'To ignore bots, use `s.automod ignorebots enable`. This is disabled by default.',
				'You can also ignore filters on mods. Juse use `s.automod ignoremods enable`. This is disabled by default.',
				'\nTo add words to the swear filter, use `s.conf set automod.swearWords <word>`.',
				'To disable filtering the words in the global filter, use `s.conf set automod.globalSwears false`. This is enabled by default.',
				'\nYou can disable filtering on certain channels per module. Just use `s.conf set automod.filterIgnore.<module> <channel>`'
			].join('\n'),
			usage: '<invite|swear|spam|mentionspam|ignorebots|ignoremods> <enable|disable>',
			usageDelim: ' ',
			subcommands: true
		});
	}

	async invite(msg, [option]) {
		await this.setAutoMod(msg, option, 'antiInvite');
		return msg.send(`<:check:508594899117932544>   ::  The AntiInvite module has been ${option}d on ${msg.guild.name}.`);
	}

	async swear(msg, [option]) {
		await this.setAutoMod(msg, option, 'antiSwear');
		return msg.send(`<:check:508594899117932544>   ::  The AntiSwear module has been ${option}d on ${msg.guild.name}.`);
	}

	async spam(msg, [option]) {
		await this.setAutoMod(msg, option, 'antiSpam');
		return msg.send(`<:check:508594899117932544>   ::  The AntiSpam module has been ${option}d on ${msg.guild.name}.`);
	}

	async mentionspam(msg, [option]) {
		await this.setAutoMod(msg, option, 'mentionSpam');
		return msg.send(`<:check:508594899117932544>   ::  The MentionSpam module has been ${option}d on ${msg.guild.name}.`);
	}

	async ignorebots(msg, [option]) {
		const _option = await this.setAutoMod(msg, option, 'ignoreBots');
		return msg.send(`<:check:508594899117932544>   ::  Automod actions will now be ${_option ? 'not ' : ''}applied on bots in ${msg.guild.name}.`);
	}

	async ignoremods(msg, [option]) {
		const _option = await this.setAutoMod(msg, option, 'ignoreMods');
		return msg.send(`<:check:508594899117932544>   ::  Automod actions will now be ${_option ? 'not ' : ''}applied on moderators in ${msg.guild.name}.`);
	}

	async setAutoMod(msg, option, type) {
		const _option = option === 'enable';
		msg.guild.settings.update(`automod.${type}`, _option);
		return _option;
	}

};
