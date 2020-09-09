const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			requiredPermissions: ['EMBED_LINKS'],
			description: 'Returns information on a Twitch.tv Account',
			usage: '<TwitchName:string>'
		});
	}

	async run(msg, [twitchName]) {
		await msg.send(`${this.client.constants.EMOTES.loading}  ::  Loading Twitch channel...`);

		const channel = await fetch(`https://api.twitch.tv/helix/users?login=${twitchName}`, {
			headers: {
				'Client-ID': 'd7sds6f41zr45c3wxkqkkslpcjukig',
				Authorization: `Bearer ${this.client.auth.twitchAPIkey}`
			}
		})
			.then(async res => {
				if (!res.ok) throw `${this.client.constants.EMOTES.xmark}  ::  An error occurred: \`${await res.json().then(data => data.message)}\``;
				return res.json();
			})
			.then(res => {
				if (!res.data.length) throw `${this.client.constants.EMOTES.xmark}  ::  There is no Twitch streamer with that name.`;
				return res.data[0];
			});

		return msg.sendEmbed(new MessageEmbed()
			.setColor(6570406)
			.setThumbnail(channel.profile_image_url)
			.setAuthor(channel.display_name, 'https://i.imgur.com/OQwQ8z0.jpg', `https://twitch.tv/${channel.display_name}`)
			.setDescription(channel.description)
			.setFooter('Click at the account name above to go to the channel.')
			.addField('Account ID', channel.id, true)
			.addField('Channel Views', channel.view_count, true));
	}

};
