const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Skips current song playing in the voice channel.',
			extendedHelp: [
				'If you want to force skip, just use the `--force` flag. Usable only by DJs and moderators.',
				'To skip to a specific entry in the queue, just do `s.skip <entry number>`. Also usable only by DJs and moderators.'
			],
			usage: '[QueueEntry:integer]'
		});
	}

	async run(msg, [entry]) {
		if (!msg.guild.player.channel || !msg.guild.player.playing) throw '<:error:508595005481549846>  ::  There is no music playing in this server!';
		if (entry && await msg.hasAtLeastPermissionLevel(5)) return this.skipToEntry(msg, entry);
		if (msg.flags.force && await msg.hasAtLeastPermissionLevel(5)) {
			msg.guild.clearVoteskips();
			msg.guild.player.stop();
			return msg.send('<:check:508594899117932544>  ::  Successfully forcibly skipped the music for this server.');
		}
		if (msg.guild.voteskips.includes(msg.author.id)) throw '<:error:508595005481549846>  ::  You\'ve already voted to skip the current song.';
		const { members } = msg.guild.channels.get(msg.guild.player.channel);
		msg.guild.addVoteskip(msg.author.id, members);
		const requiredVotes = members.filter(mb => !mb.user.bot).size / 2;
		if (msg.guild.voteskips.length <= requiredVotes) return msg.send(`<:check:508594899117932544>  ::  Successfully added your vote to skip the current song! Current votes: \`${msg.guild.voteskips.length}\`/\`${Math.ceil(requiredVotes) + 1}\`. Bots are not counted. To forcibly skip the song, use \`${msg.guildSettings.get('prefix')}skip --force\`.`); // eslint-disable-line max-len
		msg.guild.clearVoteskips();
		msg.guild.player.stop();
		return msg.send('<:check:508594899117932544>  ::  Successfully skipped the music for this server.');
	}

	async skipToEntry(msg, entry) {
		const { queue } = await this.client.providers.default.get('music', msg.guild.id);
		if (queue.length < 2) throw '<:error:508595005481549846>  ::  There is no queue entry to skip to.';
		if (entry > queue.length - 1) throw `<:error:508595005481549846>  ::  The server queue only has ${queue.length - 1} entr${queue.length - 1 === 1 ? 'y' : 'ies'}.`;
		queue.splice(1, 0, queue.splice(entry, 1)[0]);
		await this.client.providers.default.update('music', msg.guild.id, { queue });
		msg.guild.clearVoteskips();
		msg.guild.player.stop();
		return msg.send(`<:check:508594899117932544>  ::  Successfully skipped to entry \`#${entry}\`.`);
	}

};
