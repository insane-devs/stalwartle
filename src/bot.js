const { Client } = require('klasa');
const { PlayerManager } = require('discord.js-lavalink');
const { config, token } = require('./config');
const memberGateway = require('klasa-member-gateway');
const fetch = require('node-fetch');
const idiotic = require('idiotic-api');

Client.use(memberGateway);

class Stalwartle extends Client {

	constructor(...args) {
		super(...args);

		this.player = null;
		if (this.auth.idioticAPIkey) {
			this.idiot = new idiotic.Client(this.auth.idioticAPIkey, { dev: true });
			Object.defineProperty(this.idiot, 'token', { value: this.idiot.token, enumerable: false });
		}

		Stalwartle.defaultClientSchema
			.add('changelogs', 'textchannel')
			.add('bugs', bugs => bugs
				.add('reports', 'textchannel')
				.add('processed', 'textchannel'))
			.add('suggestions', suggestions => suggestions
				.add('reports', 'textchannel')
				.add('processed', 'textchannel'))
			.add('restart', restart => restart
				.add('channel', 'textchannel')
				.add('timestamp', 'number'))
			.add('errorHook', errorHook => errorHook
				.add('id', 'string')
				.add('token', 'string'))
			.add('guildHook', guildHook => guildHook
				.add('id', 'string')
				.add('token', 'string'));

		Stalwartle.defaultUserSchema
			.add('cookies', 'integer', { default: 0, configurable: false })
			.add('afktoggle', 'boolean', { default: false })
			.add('timezone', 'string', { default: 'GMT', configurable: false })
			.add('afkIgnore', 'channel', { array: true })
			.add('osu', 'string', { max: 20 });

		Stalwartle.defaultMemberSchema
			.add('muted', 'boolean', { default: false });

		Stalwartle.defaultGuildSchema
			.add('muteRole', 'role')
			.add('logging', 'boolean', { default: true })
			.add('modlogShowContent', 'boolean', { default: true })
			.add('ignored', 'channel', { array: true })
			.add('donation', 'number', { default: 0, configurable: false })
			.add('selfroles', 'role', { array: true })
			.add('globalBans', 'boolean', { default: false })
			.add('autorole', autorole => autorole
				.add('user', 'role')
				.add('bot', 'role'))
			.add('moderators', moderators => moderators
				.add('users', 'user', { array: true })
				.add('roles', 'role', { array: true }))
			.add('welcome', welcome => welcome
				.add('version', 'string', { default: 'gearz', configurable: false })
				.add('channel', 'textchannel'))
			.add('goodbye', goodbye => goodbye
				.add('version', 'string', { default: 'gearz', configurable: false })
				.add('channel', 'textchannel'))
			.add('music', music => music
				.add('announceChannel', 'textchannel')
				.add('announceSongs', 'boolean', { default: true })
				.add('autoplay', 'boolean', { default: false })
				.add('dj', 'role', { array: true })
				.add('maxPlaylist', 'integer', { min: 1, max: 1000, default: 250 })
				.add('maxQueue', 'integer', { min: 1, max: 1000, default: 250 })
				.add('maxUserRequests', 'integer', { min: 1, max: 100, default: 50 })
				.add('noDuplicates', 'boolean', { default: false })
				.add('repeat', 'string', { default: 'none', configurable: false })
				.add('volume', 'integer', { min: 1, max: 300, default: 100, configurable: false }))
			.add('modlogs', modlogs => modlogs
				.add('ban', 'channel')
				.add('kick', 'channel')
				.add('mute', 'channel')
				.add('softban', 'channel')
				.add('unban', 'channel')
				.add('unmute', 'channel')
				.add('warn', 'channel'))
			.add('automod', automod => automod
				.add('ignoreBots', 'boolean', { default: false })
				.add('ignoreMods', 'boolean', { default: false })
				.add('antiInvite', 'boolean', { default: false })
				.add('quota', 'boolean', { default: true })
				.add('antiSpam', 'boolean', { default: false })
				.add('antiSwear', 'boolean', { default: false })
				.add('mentionSpam', 'boolean', { default: false })
				.add('globalSwears', 'boolean', { default: true })
				.add('swearWords', 'string', { array: true })
				.add('filterIgnore', filterIgnore => filterIgnore
					.add('antiInvite', 'channel', { array: true })
					.add('antiSpam', 'channel', { array: true })
					.add('antiSwear', 'channel', { array: true })
					.add('mentionSpam', 'channel', { array: true }))
				.add('options', options => options
					.add('antiInvite', antiInvite => antiInvite
						.add('action', 'string', { default: 'warn', configurable: false })
						.add('duration', 'integer', { default: 5, min: 1, max: 43200 }))
					.add('quota', quota => quota
						.add('action', 'string', { default: 'mute', configurable: false })
						.add('limit', 'integer', { default: 3, min: 3, max: 50 })
						.add('within', 'integer', { default: 5, min: 1, max: 1440 })
						.add('duration', 'integer', { default: 10, min: 1, max: 43200 }))
					.add('antiSpam', antiSpam => antiSpam
						.add('action', 'string', { default: 'mute', configurable: false })
						.add('limit', 'integer', { default: 5, min: 5, max: 50 })
						.add('within', 'integer', { default: 5, min: 3, max: 600 })
						.add('duration', 'integer', { default: 5, min: 1, max: 43200 }))
					.add('antiSwear', antiSwear => antiSwear
						.add('action', 'string', { default: 'warn', configurable: false })
						.add('duration', 'integer', { default: 5, min: 1, max: 43200 }))
					.add('mentionSpam', mentionSpam => mentionSpam
						.add('action', 'string', { default: 'ban', configurable: false })
						.add('duration', 'integer', { default: 30, min: 1, max: 43200 }))));

		Stalwartle.defaultPermissionLevels
			.add(5, ({ guild, member }) => guild && (!guild.settings.get('music.dj').length || guild.settings.get('music.dj').some(role => member.roles.keyArray().includes(role))))
			.add(6, ({ guild, member }) => guild && (guild.settings.get('moderators.roles').some(role => member.roles.keyArray().includes(role)) || guild.settings.get('moderators.users').includes(member.id))) // eslint-disable-line max-len
			.add(7, ({ guild, member }) => guild && member.permissions.has('MANAGE_GUILD'))
			.add(8, ({ guild, member }) => guild && member.permissions.has('ADMINISTRATOR'))
			.add(9, ({ author }) => config.owners.includes(author.id))
			.add(10, ({ author }) => config.ownerID === author.id);
	}

	get auth() { return require('./auth'); }

	async postStats() {
		if (this.auth.ctxAPIkey) {
			fetch('https://www.carbonitex.net/discord/data/botdata.php', {
				method: 'POST',
				body: JSON.stringify({ key: this.auth.ctxAPIkey, server_count: await this.guildCount() }), // eslint-disable-line camelcase
				headers: { 'Content-Type': 'application/json' }
			});
		}
		if (this.auth.dblAPIkey) {
			fetch(`https://discordbots.org/api/bots/${this.user.id}/stats`, {
				method: 'POST',
				body: JSON.stringify({ server_count: await this.guildCount() }), // eslint-disable-line camelcase
				headers: { Authorization: this.auth.dblAPIkey, 'Content-Type': 'application/json' }
			});
		}
		if (this.auth.dbl2APIkey) {
			fetch(`https://discordbotlist.com/api/bots/${this.user.id}/stats`, {
				method: 'POST',
				body: JSON.stringify({
					guilds: await this.guildCount(),
					users: await this.userCount(),
					voice_connections: this.player.array().filter(player => player.playing).length // eslint-disable-line camelcase
				}),
				headers: { Authorization: `Bot ${this.auth.dbl2APIkey}`, 'Content-Type': 'application/json' }
			});
		}
		if (this.auth.dcbAPIkey) {
			fetch(`https://discord.bots.gg/api/v1/bots/${this.user.id}/stats`, {
				method: 'POST',
				body: JSON.stringify({ guildCount: await this.guildCount() }),
				headers: { Authorization: this.auth.dcbAPIkey, 'Content-Type': 'application/json' }
			});
		}
		if (this.auth.blsAPIkey) {
			fetch(`https://api.botlist.space/v1/bots/${this.user.id}`, {
				method: 'POST',
				body: JSON.stringify({ server_count: await this.guildCount() }), // eslint-disable-line camelcase
				headers: { Authorization: this.auth.blsAPIkey, 'Content-Type': 'application/json' }
			});
		}
		if (this.auth.bodAPIkey) {
			fetch(`https://bots.ondiscord.xyz/bot-api/bots/${this.user.id}/guilds`, {
				method: 'POST',
				body: JSON.stringify({ guildCount: await this.guildCount() }),
				headers: { Authorization: this.auth.bodAPIkey, 'Content-Type': 'application/json' }
			});
		}
	}

	async guildCount() {
		let guilds = 0;
		if (this.shard) {
			const results = await this.shard.broadcastEval('this.guilds.size');
			for (const result of results) guilds += result;
		} else {
			guilds = this.guilds.size;
		}
		return guilds;
	}

	async userCount() {
		let users = 0;
		if (this.shard) {
			const results = await this.shard.broadcastEval('this.guilds.reduce((a, b) => a + b.memberCount, 0)');
			for (const result of results) users += result;
		} else {
			users = this.guilds.reduce((a, b) => a + b.memberCount, 0);
		}
		return users;
	}

	_initplayer() {
		this.player = new PlayerManager(this, config.nodes, {
			user: this.user.id,
			shards: this.options.shardCount
		});
	}

}

new Stalwartle(config).login(token);
