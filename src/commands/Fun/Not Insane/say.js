const { Command } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            requiredPermissions: ['EMBED_LINKS'],
            description: 'Makes the bot say anything you want.',
            usage: '[delete|embed|anonymous] [Channel:channel] <Content:string{1,1000}> [...]',
            usageDelim: ' ',
            subcommands: true
        });
    }

    async messageRun(msg, [chan = msg.channel, ...msgargs]) {
        msgargs = msgargs.join(this.usageDelim);
        if (!chan.postable) throw `${this.container.client.constants.EMOTES.xmark}  ::  Sorry! I cannot send messages in that channel.`; // eslint-disable-line max-len
        if (chan !== msg.channel) msg.send(`${this.container.client.constants.EMOTES.tick}  ::  Message sent!`);
        return chan.send(msgargs);
    }

    async delete(msg, [chan = msg.channel, ...msgargs]) {
        if (!msg.guild || !msg.channel.permissionsFor(this.container.client.user).has('MANAGE_MESSAGES')) throw `${this.container.client.constants.EMOTES.xmark}  ::  Sorry! I cannot delete messages in this channel.`;
        msgargs = msgargs.join(this.usageDelim);
        if (!chan.postable) throw `${this.container.client.constants.EMOTES.xmark}  ::  Sorry! I cannot send messages in that channel.`;
        if (chan !== msg.channel) msg.send(`${this.container.client.constants.EMOTES.tick}  ::  Message sent!`);
        chan.send(msgargs);
        return msg.delete().catch(() => null);
    }

    async embed(msg, [chan = msg.channel, ...msgargs]) {
        msgargs = msgargs.join(this.usageDelim);
        if (!chan.postable) throw `${this.container.client.constants.EMOTES.xmark}  ::  Sorry! I cannot send messages in that channel.`;
        if (chan !== msg.channel) msg.send(`${this.container.client.constants.EMOTES.tick}  ::  Message sent!`);
        return chan.send({
            embed: await new MessageEmbed()
                .setColor(0x40E0D0)
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
                .setDescription(msgargs)
                .setFooter(`From #${msg.channel.name}`)
                .setTimestamp()
        });
    }

    async anonymous(msg, [chan = msg.channel, ...msgargs]) {
        if (!msg.guild || !msg.channel.permissionsFor(this.container.client.user).has('MANAGE_MESSAGES')) throw `${this.container.client.constants.EMOTES.xmark}  ::  Sorry! I cannot delete messages in this channel.`;
        msgargs = msgargs.join(this.usageDelim);
        if (!chan.postable) throw `${this.container.client.constants.EMOTES.xmark}  ::  Sorry! I cannot send messages in that channel.`;
        if (chan !== msg.channel) msg.send(`${this.container.client.constants.EMOTES.tick}  ::  Message sent!`);
        chan.send({
            embed: await new MessageEmbed()
                .setColor(0x40E0D0)
                .setAuthor('Anonymous User')
                .setDescription(msgargs)
                .setFooter(`From #${msg.channel.name}`)
                .setTimestamp()
        });
        return msg.delete().catch(() => null);
    }

};
