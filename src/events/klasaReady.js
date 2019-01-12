const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

const statuses = [
	{ name: 'dead', type: 'PLAYING' },
	{ name: 'with your feelings', type: 'PLAYING' },
	{ name: 'with sparkling 🔥', type: 'PLAYING' },
	{ name: 'hide and seek', type: 'PLAYING' },
	{ name: 'bad code', type: 'LISTENING' },
	{ name: 'with magic', type: 'PLAYING' },
	{ name: 'Cops and Robbers', type: 'PLAYING' },
	{ name: 'Simon Says', type: 'PLAYING' },
	{ name: 'I Spy', type: 'PLAYING' },
	{ name: 'chess', type: 'PLAYING' },
	{ name: 'with a rubber duck', type: 'PLAYING' },
	{ name: 'your movements', type: 'WATCHING' },
	{ name: 'Stranger Things', type: 'WATCHING' },
	{ name: 'Steven Universe', type: 'WATCHING' },
	{ name: 'anime', type: 'WATCHING' },
	{ name: 'Spotify', type: 'LISTENING' },
	{ name: 'Pop Rock', type: 'LISTENING' },
	{ name: 'P!ATD', type: 'LISTENING' },
	{ name: 'Fall Out Boy', type: 'LISTENING' },
	{ name: 'Ariana Grande', type: 'LISTENING' },
	{ name: 'Little Mix', type: 'LISTENING' }
];

module.exports = class extends Event {

	async run() {
		this.client._initplayer();
		this.client.setGuildCount().then(() => this.client.setInterval(() => this.client.setGuildCount(), 1000 * 60 * 5));
		this.client.user.setActivity('Just started running! 👀', { type: 'WATCHING' }).then(() => {
			this.client.setInterval(() => {
				const status = statuses[Math.floor(Math.random() * statuses.length)];
				this.client.user.setActivity(`${status.name} | ${this.client.options.prefix}help`, { type: status.type });
			}, 60000);
		});
		const { channel, timestamp } = this.client.settings.get('restart');
		if (!channel) return;
		this.client.channels.get(channel).send({
			embed: new MessageEmbed()
				.setColor(0x40E0D0)
				.setTitle('Bot has successfully restarted!')
				.setThumbnail(this.client.user.displayAvatarURL())
				.setDescription(`**Creeping through Discord...**\nand doing some magic!\n\nCurrently running on **${this.client.guilds.size}** guilds with **${this.client.guilds.reduce((a, b) => a + b.memberCount, 1)}** users.`) // eslint-disable-line max-len
				.setFooter(`Reboot duration: ${+`${`${Math.round(`${`${(Date.now() - timestamp) / 1000}e+2`}`)}e-2`}`}s`)
				.setTimestamp()
		});
		this.client.settings.reset(['restart.channel', 'restart.timestamp']);
	}

};
