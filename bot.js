const { Client } = require('klasa');
const { config, token } = require('./config');
const { blsAPIkey, dblAPIkey, dpwAPIkey, idioticAPIkey } = require('./auth');
const snekfetch = require('snekfetch');
const idiotic = require('idiotic-api');

class Stalwartle extends Client {

	constructor(...args) {
		super(...args);

		Stalwartle.defaultPermissionLevels
			.add(6, (client, msg) => msg.guild && (msg.guild.settings.moderators.roles.some(role => msg.member.roles.keyArray().includes(role)) || msg.guild.settings.moderators.users.includes(msg.member.id))) // eslint-disable-line max-len
			.add(7, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
			.add(8, (client, msg) => msg.guild && msg.member.permissions.has('ADMINISTRATOR'))
			.add(9, (client, msg) => config.owners.includes(msg.author.id))
			.add(10, (client, msg) => config.ownerID === msg.author.id);

		if (idioticAPIkey) {
			this.idiot = new idiotic.Client(idioticAPIkey, { dev: true });
			Object.defineProperty(this.idiot, 'token', { value: this.idiot.token, enumerable: false });
		}
	}

	async setGuildCount() {
		this.user.setActivity(`${this.guilds.size} servers | ${config.prefix}help`, { type: 'LISTENING' });
		if (!this.application.botPublic) return null;
		if (dblAPIkey) {
			snekfetch.post(`https://discordbots.org/api/bots/${this.user.id}/stats`)
				.set('Authorization', dblAPIkey)
				.send({ server_count: await this.guildCount() }) // eslint-disable-line camelcase
				.catch(err => this.emit('error', err.stack));
		}
		if (dpwAPIkey) {
			snekfetch.post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`)
				.set('Authorization', dpwAPIkey)
				.send({ server_count: await this.guildCount() }) // eslint-disable-line camelcase
				.catch(err => this.emit('error', err.stack));
		}
		if (blsAPIkey) {
			snekfetch.post(`https://botlist.space/api/bots/${this.user.id}`)
				.set('Authorization', blsAPIkey)
				.send({ server_count: await this.guildCount() }) // eslint-disable-line camelcase
				.catch(err => this.emit('error', err.stack));
		}
		return undefined;
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

}

new Stalwartle(config).login(token);
