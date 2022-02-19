const { Command } = require('@sapphire/framework');
const { send } = require('@sapphire/plugin-editable-commands');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(context, options) {
        super(context, {
            ...options,
            cooldownDelay: 10,
            requiredClientPermissions: ['ATTACH_FILES'],
            description: 'Grabs a random panda image and fact.'
        });
    }

    async messageRun(msg) {
        const message = await send(msg, `${this.container.constants.EMOTES.loading}  ::  Loading panda...`);

        const { image, fact } = await fetch(`https://some-random-api.ml/animal/panda`)
            .then(res => res.json())
            .catch(() => ({ image: null, fact: null }));
        if (!image || !fact) return send(msg, `${this.container.constants.EMOTES.xmark}  ::  An unexpected error occured. Sorry about that!`);
        await send(message, { files: [{ attachment: image, name: 'panda.jpg' }], content: `Random panda fact: ${fact}` });

        message.delete();
        return true;
    }

};
