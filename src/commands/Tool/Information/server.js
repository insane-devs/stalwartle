const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { reply } = require('@sapphire/plugin-editable-commands');
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');

module.exports = class extends SubCommandPluginCommand {

    constructor(context, options) {
        super(context, {
            ...options,
            aliases: ['si', 'sinfo', 'serverinfo'],
            runIn: [CommandOptionsRunTypeEnum.GuildText],
            requiredClientPermissions: ['EMBED_LINKS'],
            description: 'Gives information about the current server.',
            subCommands: ['icon', 'roles', 'id', { input: 'default', default: true }]
        });
    }

    async default(msg) {
        const { timezone } = this.container.stores.get('gateways').get('userGateway').get(msg.author.id);

        return reply(msg, {
            embeds: [new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({ name: msg.guild.name, iconURL: msg.guild.iconURL({ dynamic: true, format: 'png' }) })
                .setThumbnail(msg.guild.iconURL({ dynamic: true, format: 'png' }))
                .addField('ID', msg.guild.id, true)
                .addField('Owner', await msg.guild.members.fetch(msg.guild.ownerId).then(owner => `${owner.user.tag}\n(${owner})`), true)
                .addField('Verification Level', {
                    NONE: 'None (Unrestricted)',
                    LOW: 'Low (Requires a verified email)',
                    MEDIUM: 'Medium (5 mins must\'ve elapsed since registry)',
                    HIGH: 'High (10 mins must\'ve elapsed since user join)',
                    VERY_HIGH: 'Very High (Needs a verified phone number)'
                }[msg.guild.verificationLevel], true)
                .addField('Two-Factor Requirement', msg.guild.mfaLevel === 'ELEVATED' ? 'Enabled' : 'Disabled', true)
                .addField('Explicit Content Filter', {
                    DISABLED: 'Don\'t scan any messages.',
                    MEMBERS_WITHOUT_ROLES: 'Scan messages from members without a role.',
                    ALL_MEMBERS: 'Scan messages sent by all members.'
                }[msg.guild.explicitContentFilter], true)
                .addField('Member Count', String(msg.guild.memberCount), true)
                .addField('Role Count', msg.guild.roles.cache.size > 1 ? String(msg.guild.roles.cache.size) : 'None', true)
                .addField('Text Channel Count', String(msg.guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size), true)
                .addField('Voice Channel Count', String(msg.guild.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size), true)
                .addField('Created', `${moment(msg.guild.createdAt).tz(timezone).format('dddd, LL | LTS z')}\n>> ${moment(msg.guild.createdAt).fromNow()}`)
                .setFooter({ text: `Information requested by ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()]
        });
    }

    async icon(msg) {
        return reply(msg, {
            embeds: [new MessageEmbed()
                .setColor('RANDOM')
                .setImage(msg.guild.iconURL({ dynamic: true, format: 'png', size: 2048 }))]
        });
    }

    async roles(msg) {
        if (msg.guild.roles.cache.size === 1) return reply(msg, 'This server doesn\'t have any role yet!');
        return reply(msg, {
            embeds: [new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${msg.guild.name}'s Roles [${msg.guild.roles.cache.size}]`)
                .setDescription(Array.from(msg.guild.roles.cache.sort((a, b) => b.position - a.position).values()).join(' | '))]
        });
    }

    async id(msg) {
        reply(msg, `The server ID of ${msg.guild} is \`${msg.guild.id}\`.`);
    }

};
