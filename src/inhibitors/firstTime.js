const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, command) {
		if (!msg.guild) return null;
		if (command.category === 'Moderation') await this.checkTable(msg.guild.id, 'modlogs');
		if (command.category === 'Music') await this.checkTable(msg.guild.id, 'music');
		return null;
	}

	async checkTable(guild, table) {
		const defProvider = this.client.providers.default;
		if (await this.client.providers.default.get(table, guild)) return null;
		await defProvider.create(table, guild);
		const obj = {
			modlogs: { modlogs: [] },
			music: { history: [], playlist: [], queue: [] }
		};
		return defProvider.update(table, guild, obj[table]);
	}

};
