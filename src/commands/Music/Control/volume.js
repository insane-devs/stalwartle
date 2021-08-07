const { Command } = require('@sapphire/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 5,
			aliases: ['vol'],
			runIn: ['text'],
			description: 'Changes the volume for music sessions in the server.',
			usage: '[Volume:integer{1,300}]'
		});
	}

	async run(msg, [volume]) {
		if (!volume) return msg.send(`🎚  ::  The volume for this server is currently set to ${msg.guild.settings.get('music.volume')}%.`);
		msg.guild.settings.update('music.volume', volume);
		if (msg.guild.player) msg.guild.player.volume(volume);
		return msg.send(`${this.client.constants.EMOTES.tick}  ::  Successfully changed the volume for this server to ${volume}%.`);
	}

};
