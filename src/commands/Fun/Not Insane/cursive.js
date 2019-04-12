const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Converts a text into its cursive form.',
			extendedHelp: 'If you want to get the bolded form, simply use the `--bold` flag.',
			usage: '<Cursive:string>'
		});
	}

	async run(msg, [text]) {
		let type = 'normal';
		if (msg.flags.bold) type = 'bold';
		await msg.send('<a:loading:430269209415516160>  ::  Converting text...');
		msg.send(await this.client.idiot.cursive(text, type));
	}

};
