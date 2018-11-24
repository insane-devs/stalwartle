const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 5,
			description: 'Resumes paused music in the server.'
		});
	}

	async run(msg) {
		if (!msg.guild.player.channel || !msg.guild.player.playing) throw '<:error:508595005481549846>  ::  There is no music playing in this server!';
		if (!msg.guild.player.paused) throw `<:error:508595005481549846>  ::  Music is already playing! Pause it with \`${msg.guildSettings.get('prefix')}pause\``;
		msg.guild.player.pause(false);
		return msg.send('<:check:508594899117932544>  ::  Successfully resumed the music for this server.');
	}

};
