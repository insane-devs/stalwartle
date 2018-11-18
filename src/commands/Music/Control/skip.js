const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Skips current song playing in the voice channel.' });
	}

	async run(msg) {
		if (!msg.guild.me.voice.channel ||
			!msg.guild.voiceConnection ||
			(msg.guild.voiceConnection && !msg.guild.voiceConnection.dispatcher) ||
			(msg.guild.voiceConnection.dispatcher && !msg.guild.voiceConnection.dispatcher.writable)) throw '<:error:508595005481549846>  ::  There is no music playing in this server!';
		msg.guild.voiceConnection.dispatcher.end();
		return msg.send('<:check:508594899117932544>  ::  Successfully skipped the music for this server.');
	}

};
