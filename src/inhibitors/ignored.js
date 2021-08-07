const { Inhibitor } = require('@sapphire/framework');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (!msg.guild) return;
		if (cmd.name === 'ignore') return;
		if (msg.guild.settings.get('ignored').includes(msg.channel.id)) throw '🔇  ::  This channel is included in this server\'s ignored channels.';
	}

};
