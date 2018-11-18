const { Command, util: { escapeMarkdown } } = require('klasa');
const { googleAPIkey } = require('../../../auth');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			requiredPermissions: ['CONNECT', 'SPEAK'],
			description: 'Plays music in the server.',
			usage: '<YouTubeLink:url|Song:integer|Query:string>'
		});
	}

	async run(msg, [song]) {
		if (!msg.member.voice.channel) throw '<:error:508595005481549846>  ::  Please connect to a voice channel first.';
		let url;
		if (typeof song === 'number') {
			if (!msg.member.queue.length) throw `<:error:508595005481549846>  ::  Please provide a search query first.`;
			if (song > msg.member.queue.length) throw `<:error:508595005481549846>  ::  Please pick a number from 1 to ${msg.member.queue.length}.`;
			url = msg.member.queue[song - 1];
			msg.member.clearPrompt();
		} else if (ytdl.validateURL(song)) {
			url = song;
		} else {
			const params = [];
			for (const [key, value] of Object.entries({
				key: googleAPIkey,
				type: 'video',
				part: 'snippet',
				q: encodeURIComponent(song) // eslint-disable-line id-length
			})) params.push(`${key}=${value}`);
			const videos = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.join('&')}`).then(res => res.json()).then(res => res.items);
			if (!videos.length) {
				throw `<:error:508595005481549846>  ::  No video found for **${song}**.`;
			} else if (videos.length === 1) {
				url = `https://youtu.be/${videos[0].id.videoId}`;
			} else {
				msg.member.addPrompt(videos.map(vid => `https://youtu.be/${vid.id.videoId}`));
				return msg.send([
					`🎶  ::  Please pick the number of the video you want to play: \`${msg.guildSettings.get('prefix')}play <number>\``,
					videos.map((vid, index) => `\`${index + 1}\`. **${vid.snippet.title}** by ${vid.snippet.channelTitle}`).join('\n')
				].join('\n'));
			}
		}
		const info = await ytdl.getBasicInfo(url);
		if (parseInt(info.length_seconds) > 18000) throw `<:error:508595005481549846>  ::  **${info.title}** is longer than 5 hours.`;
		return this.play(msg, url);
	}

	async addToQueue(msg, url) {
		const { queue } = await this.client.providers.default.get('music', msg.guild.id);
		queue.push(url);
		this.client.providers.default.update('music', msg.guild.id, { queue });
		return msg.channel.send(`🎶  ::  **${await ytdl.getBasicInfo(url).then(info => info.title)}** has been added to the queue.`);
	}

	async play(msg, song) {
		msg.member.voice.channel.join();
		if (msg.flags.force || !msg.guild.voiceConnection.dispatcher || !msg.guild.voiceConnection.dispatcher.writable) {
			msg.guild.voiceConnection.play(ytdl(song, { quality: 'highestaudio' })).on('end', async () => {
				const { queue } = await this.client.providers.default.get('music', msg.guild.id);
				queue.shift();
				this.client.providers.default.update('music', msg.guild.id, { queue });
				if (queue.length) {
					this.play(msg, queue[0]);
				} else {
					msg.channel.send('👋  ::  No song left in the queue, so the music session has ended! Thanks for listening!');
					msg.guild.voiceConnection.dispatcher.destroy();
					msg.guild.me.voice.channel.leave();
				}
			});
		} else {
			return this.addToQueue(msg, song);
		}
		const info = await ytdl.getBasicInfo(song);
		return msg.channel.send(`🎧  ::  Now Playing: **${escapeMarkdown(info.title)}** on *${escapeMarkdown(info.author.name)}*`);
	}

	async init() {
		const defProvider = this.client.providers.default;
		if (!await defProvider.hasTable('music')) defProvider.createTable('music');
	}

};
