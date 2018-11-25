const { Command } = require('klasa');
const { escapeMarkdown } = require('discord.js').Util;
const { parse } = require('url');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Plays music in the server. Uses YouTube and SoundCloud.',
			extendedHelp: [
				'To continue playing from the current music queue (if stopped), simply do not supply any argument.',
				'Use SoundCloud with your searches just by simply using the `--soundcloud` flag! e.g. `s.play Imagine Dragons - Natural --soundcloud`',
				'To force play a song, just use the `--force` flag. e.g. `s.play twenty one pilots - Jumpsuit` AND THEN `s.play <choice number> -- force`. For URLs, just use the `--force` flag directly.'
			],
			usage: '[YouTubeOrSoundCloud:url|Song:integer|Query:string]'
		});
	}

	async run(msg, [query]) {
		if (!msg.guild.player.channel) throw `<:error:508595005481549846>  ::  The bot is not connected to a voice channel. Please use the \`${msg.guildSettings.get('prefix')}join\` command.`;
		const { queue } = await this.client.providers.default.get('music', msg.guild.id);
		if (!query) {
			if (!queue.length) throw `<:error:508595005481549846>  ::  There are no songs in the queue. Add one using \`${msg.guildSettings.get('prefix')}play\``;
			else return this.play(msg, queue[0]);
		}
		const url = parse(String(query));
		let song;
		if (url.protocol && url.hostname) {
			const linkRes = await this.getSongs(query, true, url.hostname.includes('soundcloud'));
			if (!linkRes.length) throw '<:error:508595005481549846>  ::  You provided an invalid URL.';
			song = linkRes[0]; // eslint-disable-line prefer-destructuring
		} else if (typeof query === 'number') {
			if (!msg.member.queue.length) throw '<:error:508595005481549846>  ::  Please provide a search query first.';
			if (query < 1 || query > msg.member.queue.length) throw `<:error:508595005481549846>  ::  Please pick a number from 1 to ${msg.member.queue.length}.`;
			song = msg.member.queue[query - 1];
			msg.member.clearPrompt();
		} else {
			const results = await this.getSongs(query, false, Boolean(msg.flags.soundcloud));
			if (!results.length) {
				throw `<:error:508595005481549846>  ::  No result found for **${query}**.`;
			} else if (results.length === 1) {
				song = results[0]; // eslint-disable-line prefer-destructuring
			} else {
				const finds = results.splice(0, 5);
				msg.member.addPrompt(finds);
				return msg.send([
					`🎶  ::  Please pick the number of the song you want to play: \`${msg.guildSettings.get('prefix')}play <number>\``,
					finds.map((result, index) => `\`${index + 1}\`. **${escapeMarkdown(result.info.title)}** by ${escapeMarkdown(result.info.author)}`).join('\n')
				].join('\n'));
			}
		}
		if (parseInt(song.info.length) > 18000000) throw `<:error:508595005481549846>  ::  **${song.info.title}** is longer than 5 hours.`;
		await this.addToQueue(msg, song);
		if (msg.flags.force && await msg.hasAtLeastPermissionLevel(5)) return msg.guild.player.stop();
		return this.play(msg, queue.length ? queue[0] : song);
	}

	async getSongs(query, raw, soundcloud) {
		return await fetch(`http://${this.client.options.nodes[0].host}:${this.client.options.nodes[0].port}/loadtracks?identifier=${soundcloud ? 'scsearch' : 'ytsearch'}:${raw ? query : encodeURIComponent(query)}`, { headers: { Authorization: this.client.options.nodes[0].password } }).then(res => res.json()).then(res => res.tracks); // eslint-disable-line max-len
	}

	async addToQueue(msg, song) {
		const { queue } = await this.client.providers.default.get('music', msg.guild.id);
		if (msg.flags.force && await msg.hasAtLeastPermissionLevel(5)) {
			queue.splice(1, 0, song);
			msg.channel.send(`🎶  ::  Forcibly played **${song.info.title}**.`);
		} else {
			if (queue.length >= 250) throw `<:error:508595005481549846>  ::  The music queue for **${msg.guild.name}** has reached the limit of 250 songs; currently ${queue.length}.`;
			queue.push(song);
			msg.channel.send(`🎶  ::  **${song.info.title}** has been added to the queue.`);
		}
		await this.client.providers.default.update('music', msg.guild.id, { queue });
		return queue;
	}

	async play(msg, song) {
		if (msg.guild.player.playing) return null;
		msg.guild.player.play(song.track);
		msg.guild.player.pause(false);
		msg.guild.player.volume(msg.guild.settings.get('music.volume'));
		msg.guild.player.once('error', error => this.client.emit('wtf', error));
		msg.guild.player.once('end', async data => {
			if (data.reason === 'REPLACED') return;
			const { queue } = await this.client.providers.default.get('music', msg.guild.id);
			if (msg.guild.settings.get('music.repeat') === 'queue') queue.push(queue[0]);
			if (msg.guild.settings.get('music.repeat') !== 'song') queue.shift();
			this.client.providers.default.update('music', msg.guild.id, { queue });
			if (queue.length) {
				this.play(msg, queue[0]);
			} else {
				msg.channel.send('👋  ::  No song left in the queue, so the music session has ended! Thanks for listening!');
				this.client.player.leave(msg.guild.id);
			}
		});
		return msg.channel.send(`🎧  ::  Now Playing: **${escapeMarkdown(song.info.title)}** by ${song.info.author}`);
	}

	async init() {
		const defProvider = this.client.providers.default;
		if (!await defProvider.hasTable('music')) defProvider.createTable('music');
	}

};
