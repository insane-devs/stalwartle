const { Task } = require('klasa');

module.exports = class extends Task {

	async run() {
		for (const { history, id } of await this.client.providers.default.getAll('music')) {
			this.client.providers.default.update('music', id, { history: history.filter(hist => (Date.now() - hist.timestamp) <= (1000 * 60 * 60 * 24)) });
		}

		// Create a schedule to make this task work
		if (this.client.schedule.tasks.filter(tk => tk.taskName === 'shiftHistory').length === 1) return;
		do {
			this.client.schedule.tasks.filter(tk => tk.taskName === 'shiftHistory').forEach(tk => this.client.schedule.delete(tk.id));
			await this.client.schedule.create('shiftHistory', '*/7 * * * *');
		} while (this.client.schedule.tasks.filter(tk => tk.taskName === 'shiftHistory').length !== 1);
	}

	async init() {
		this.run();
	}

};
