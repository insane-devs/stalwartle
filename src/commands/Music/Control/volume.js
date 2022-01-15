const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            permissionLevel: 5,
            aliases: ['vol'],
            runIn: [CommandOptionsRunTypeEnum.GuildText],
            description: 'Changes the volume for music sessions in the server.',
            usage: '[Volume:integer{1,300}]'
        });
    }

    async messageRun(msg, [volume]) {
        if (!volume) return msg.send(`🎚  ::  The volume for this server is currently set to ${msg.guild.settings.get('music.volume')}%.`);
        msg.guild.settings.update('music.volume', volume);
        if (this.container.lavacord.players.get(msg.guild.id)) this.container.lavacord.players.get(msg.guild.id).volume(volume);
        return msg.send(`${this.container.constants.EMOTES.tick}  ::  Successfully changed the volume for this server to ${volume}%.`);
    }

};
