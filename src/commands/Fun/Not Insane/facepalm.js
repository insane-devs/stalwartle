const { Command } = require('@sapphire/framework');
const { send } = require('@sapphire/plugin-editable-commands');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(context, options) {
        super(context, {
            ...options,
            requiredClientPermissions: ['EMBED_LINKS'],
            description: 'Gives a random facepalm GIF.'
        });
    }

    async messageRun(msg) {
        await send(msg, `${this.container.constants.EMOTES.loading}  ::  Loading GIF...`);

        const { link } = await fetch(`https://some-random-api.ml/animu/face-palm`)
            .then(res => res.json())
            .catch(() => ({ link: null }));
        if (!link) return send(msg, `${this.container.constants.EMOTES.xmark}  ::  An unexpected error occured. Sorry about that!`);
        return send(msg, { files: [{ attachment: link, name: 'facepalm.gif' }], content: '🤦‍♂️' });
    }

};
