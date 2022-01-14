const { Command } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['ri', 'rinfo', 'roleinfo'],
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            description: 'Gives information about a role.',
            extendedHelp: "You can use the role's name in providing the role.",
            usage: '[id] <Role:role>',
            usageDelim: ' ',
            subcommands: true
        });
    }

    async messageRun(msg, [role]) {
        const timezone = msg.author.settings.get('timezone');

        function hexToRgb(hex) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (mm, rd, gn, bl) => rd + rd + gn + gn + bl + bl);
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            var rgbObj = result ? {
                rd: parseInt(result[1], 16),
                gn: parseInt(result[2], 16),
                bl: parseInt(result[3], 16)
            } : null;

            return [rgbObj.rd, rgbObj.gn, rgbObj.bl];
        }

        const avatarURL = msg.author.displayAvatarURL({ dynamic: true });
        msg.send({
            embed: new MessageEmbed()
                .setColor(role.hexColor)
                .setAuthor(`Role information for ${role.name}`)
                .addField('ID', role.id)
                .addField('Hoisted', `${role.hoist}`.replace(/^./, i => i.toUpperCase()), true)
                .addField('Managed', `${role.managed}`.replace(/^./, i => i.toUpperCase()), true)
                .addField('Mentionable', `${role.mentionable}`.replace(/^./, i => i.toUpperCase()), true)
                .addField('Color', `HEX: ${role.hexColor}\nRGB: ${hexToRgb(role.hexColor).join(', ')}`, true)
                .addField('Position', `${msg.guild.roles.cache.size - role.position} out of ${msg.guild.roles.cache.size}`, true)
                .addField('Created', `${moment(role.createdAt).tz(timezone).format('dddd, LL | LTS z')}\n>> ${moment(role.createdAt).fromNow()}`)
                .setFooter(`Information requested by ${msg.author.tag}`, avatarURL)
                .setTimestamp()
        });
    }

    async id(msg, [role]) {
        return msg.send(`The role ID of **${role.name}** is \`${role.id}\`.`);
    }

};
