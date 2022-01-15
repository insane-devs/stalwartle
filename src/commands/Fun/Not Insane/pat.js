const { Command } = require('@sapphire/framework');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            requiredPermissions: ['EMBED_LINKS'],
            description: 'Gives a random pat GIF.'
        });
    }

    async messageRun(msg) {
        const message = await msg.channel.send(`${this.container.constants.EMOTES.loading}  ::  Loading GIF...`);

        const { link } = await fetch(`https://some-random-api.ml/animu/pat`)
            .then(res => res.json())
            .catch(() => { throw `${this.container.constants.EMOTES.xmark}  ::  An unexpected error occured. Sorry about that!`; });
        msg.channel.sendFile(link, 'pat.gif');

        message.delete();
    }

};
