const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			requiredPermissions: ['EMBED_LINKS'],
			description: 'Gives map information of a search location, with map zoom.',
			extendedHelp: 'To change zoom, use `--zoom=(integer)` e.g. `s.map Tokyo, Japan --zoom=24`',
			usage: '<Location:string>'
		});
	}

	async run(msg, [location]) {
		await msg.send(`${this.client.constants.EMOTES.loading}  ::  Loading map...`);
		const zoom = msg.flagArgs.zoom ? parseInt(msg.flagArgs.zoom) : 12;
		const { data } = await fetch(`https://api.ksoft.si/kumo/gis?q=${encodeURIComponent(location)}&include_map=true&map_zoom=${isNaN(zoom) ? 12 : zoom}`, { headers: { Authorization: `Bearer ${this.client.auth.ksoftAPIkey}` } }).then(res => res.json()); // eslint-disable-line max-len
		if (!data) throw `${this.client.constants.EMOTES.xmark}  ::  I could not find that location.`;
		msg.send({
			embed: new MessageEmbed()
				.setColor('RANDOM')
				.setTitle('🗺 Map Information')
				.setTimestamp()
				.setImage(data.map)
				.addField('Address', data.address)
				.addField('Latitude', data.lat, true)
				.addField('Longitude', data.lon, true)
		});
	}

};
