const { Command } = require('klasa');
const { escapeMarkdown } = require('discord.js').Util;
const fetch = require('node-fetch');

const YOUTUBE_SOUNDCLOUD_REGEX = /^(https?:\/\/)?(www\.)?(soundcloud\.com|youtube\.com|youtu\.?be)\/.+$/,
	YOUTUBE_PLAYLIST_REGEX = new RegExp('[&?]list=([a-z0-9-_]+)', 'i');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Plays music in the server. Accepts YouTube, YouTube playlists, SoundCloud, and online radios.',
			extendedHelp: [
				'To continue playing from the current music queue (if stopped), simply do not supply any argument.',
				'Use SoundCloud with your searches just by simply using the `--soundcloud` flag! e.g. `s.play Imagine Dragons - Natural --soundcloud`',
				'To force play a song, just use the `--force` flag. e.g. `s.play twenty one pilots - Jumpsuit`.',
				'\nTo insert a whole YouTube playlist into the queue, just supply the playlist link.',
				'To play an online radio (`.m3u`, `.pls`, `.xspf`), simply supply the radio link.'
			],
			usage: '[YouTubeOrSoundCloud:url|Query:string]'
		});
	}

	async run(msg, [query]) {
		if (!msg.member.voice.channel) throw '<:error:508595005481549846>  ::  Please connect to a voice channel first.';
		if (!msg.member.voice.channel.permissionsFor(msg.guild.me.id).has(['CONNECT', 'SPEAK'])) throw `<:error:508595005481549846>  ::  I do not have the required permissions (**Connect**, **Speak**) to play music in #**${msg.member.voice.channel.name}**.`; // eslint-disable-line max-len
		if (msg.member.queue.length) throw '<:error:508595005481549846>  ::  You are currently being prompted. Please pick one first or cancel the prompt.';
		const { queue } = await this.client.providers.default.get('music', msg.guild.id);
		if (!query) {
			if (!queue.length) throw `<:error:508595005481549846>  ::  There are no songs in the queue. Add one using \`${msg.guildSettings.get('prefix')}play\``;
			if (!msg.guild.player.channel) this.join(msg);
			if (msg.guild.player.playing) throw '<:error:508595005481549846>  ::  Music is playing in this server, however you can still enqueue a song.';
			else return this.play(msg, queue[0]);
		}
		const song = await this.resolveQuery(msg, query);
		msg.member.clearPrompt();
		if (!Array.isArray(song) && !song.info.isStream && song.info.length > 18000000) throw `<:error:508595005481549846>  ::  **${song.info.title}** is longer than 5 hours.`;
		if (!msg.guild.player.channel) this.join(msg);
		await this.addToQueue(msg, song);
		if (msg.flags.force && await msg.hasAtLeastPermissionLevel(5)) return msg.guild.player.stop();
		return this.play(msg, queue.length ? queue[0] : Array.isArray(song) ? song[0] : song);
	}

	join(msg) {
		this.client.player.leave(msg.guild.id);
		this.client.player.join({
			host: this.client.options.nodes[0].host,
			guild: msg.guild.id,
			channel: msg.member.voice.channel.id
		}, { selfdeaf: true });
	}

	async resolveQuery(msg, query) {
		if (YOUTUBE_SOUNDCLOUD_REGEX.test(query) || ['.m3u', '.pls', 'xspf'].includes(query.slice(-4))) {
			const linkRes = await this.getSongs(query, query.includes('soundcloud.com'));
			if (!linkRes.length) throw '<:error:508595005481549846>  ::  You provided an invalid URL.';
			if (YOUTUBE_PLAYLIST_REGEX.test(query)) return linkRes;
			else return linkRes[0];
		} else {
			const results = await this.getSongs(query, Boolean(msg.flags.soundcloud));
			if (!results.length) throw `<:error:508595005481549846>  ::  No result found for **${query}**.`;
			else if (results.length === 1) return results[0];

			const finds = results.slice(0, 5);
			msg.member.addPrompt(finds);
			let limit = 0, choice;
			do {
				if (limit >= 5) {
					msg.member.clearPrompt();
					throw '<:error:508595005481549846>  ::  Too many invalid replies. Please try again.';
				}
				limit++;
				choice = await msg.prompt([
					`🎶  ::  **${escapeMarkdown(msg.member.displayName)}**, please **reply** the number of the song you want to play: (reply \`cancel\` to cancel prompt)`,
					finds.map((result, index) => `\`${index + 1}\`. **${escapeMarkdown(result.info.title)}** by ${escapeMarkdown(result.info.author)}`).join('\n')
				].join('\n')).catch(() => ({ content: 'cancel' }));
			} while ((choice.content !== 'cancel' && !parseInt(choice.content)) || parseInt(choice.content) < 1 || parseInt(choice.content) > msg.member.queue.length);
			if (choice.content === 'cancel') {
				msg.member.clearPrompt();
				throw '<:check:508594899117932544>  ::  Successfully cancelled prompt.';
			}
			return msg.member.queue[parseInt(choice.content) - 1];
		}
	}

	async getSongs(query, soundcloud) {
		let searchString;
		if (YOUTUBE_SOUNDCLOUD_REGEX.test(query) || ['.m3u', '.pls', 'xspf'].includes(query.slice(-4))) {
			searchString = query;
			if (searchString.includes('&list') || searchString.includes('?list')) {
				searchString = `https://youtube.com/playlist?list=${YOUTUBE_PLAYLIST_REGEX.exec(searchString)[1]}`;
			}
		} else { searchString = `${soundcloud ? 'scsearch' : 'ytsearch'}:${encodeURIComponent(query)}`; }
		const data = await fetch(`http://${this.client.options.nodes[0].host}:${this.client.options.nodes[0].port}/loadtracks?identifier=${searchString}`, { headers: { Authorization: this.client.options.nodes[0].password } }) // eslint-disable-line max-len
			.then(res => res.json())
			.catch(err => {
				this.client.emit('wtf', err);
				throw '<:error:508595005481549846>  ::  There was an error, please try again.';
			});
		return data.tracks;
	}

	async addToQueue(msg, song) {
		const { queue } = await this.client.providers.default.get('music', msg.guild.id);
		if (Array.isArray(song)) {
			if (queue.length >= 250) throw `<:error:508595005481549846>  ::  The music queue for **${msg.guild.name}** has reached the limit of 250 songs; currently ${queue.length}.`;
			let songCount = 0;
			for (const track of song) {
				if (track.info.length > 18000000) continue;
				queue.push(track);
				songCount++;
			}
			msg.channel.send(`🎶  ::  **${songCount} song${songCount === 1 ? '' : 's'}** ha${songCount === 1 ? '' : 's'} been added to the queue. All songs longer than 5 hours weren't added.`);
		} else if (msg.flags.force && await msg.hasAtLeastPermissionLevel(5)) {
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
		msg.guild.clearVoteskips();
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
