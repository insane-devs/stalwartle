const { Command } = require('@sapphire/framework');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            permissionLevel: 5,
            runIn: ['text'],
            description: 'Replays the current playing song.'
        });
    }

    async messageRun(msg) {
        if (!msg.guild.player || !msg.guild.player.playing) throw `${this.container.client.constants.EMOTES.xmark}  ::  No song playing! Add one using \`${msg.guild.settings.get('prefix')}play\``;
        const song = ((await this.container.client.providers.default.get('music', msg.guild.id) || {}).queue || [])[0];
        if (!song.info.isSeekable) throw `${this.container.client.constants.EMOTES.xmark}  ::  The current track playing cannot be replayed.`;
        msg.guild.player.seek(0);
        msg.guild.player.pause(false);
        return msg.send(`${this.container.client.constants.EMOTES.tick}  ::  Successfully replayed the music.`);
    }

};
