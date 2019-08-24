const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			event: 'voiceStateUpdate'
		});
	}

	async run(oldState, newState) {
		if (!newState.guild.me.permissions.has('MOVE_MEMBERS')) return null;
		if (!newState.guild.settings.get('afkChannelOnAfk')) return null;
		if (!newState.member.voice.channelID) return null;
		if (!newState.guild.afkChannelID) return null;
		if (newState.channelID === newState.guild.afkChannelID) return null;
		return newState.setChannel(newState.guild.afkChannelID, 'Moved to AFK channel due to AFK status');
	}

};
