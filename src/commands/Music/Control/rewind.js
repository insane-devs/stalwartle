const { Command } = require('@sapphire/framework');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            permissionLevel: 5,
            runIn: ['text'],
            description: 'Rewinds the current song to the specified time.',
            extendedHelp: 'To use this command use e.g. `22m 29s` to rewind the song by 22 minutes and 29 seconds',
            usage: '<SeekTime:time>'
        });
    }

    async run(msg, [seek]) {
        seek -= Date.now();
        const song = await this.container.client.providers.default.get('music', msg.guild.id).then(ms => ms.queue[0]);
        if (!msg.guild.me.voice.channel) throw `${this.container.client.constants.EMOTES.xmark}  ::  No song playing! Add one using \`${msg.guild.settings.get('prefix')}play\``;
        if (!song.info.isSeekable) throw `${this.container.client.constants.EMOTES.xmark}  ::  The current track playing cannot be rewinded.`;
        this.container.client.lavacord.players.get(msg.guild.id).seek(this.container.client.lavacord.players.get(msg.guild.id).state.position - seek);
        return msg.send(`${this.container.client.constants.EMOTES.tick}  ::  Successfully rewinded the music.`);
    }

};
