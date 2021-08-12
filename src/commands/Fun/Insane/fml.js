const { Command } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            requiredPermissions: ['EMBED_LINKS'],
            description: 'Gets a random FML story.'
        });
    }

    async run(msg) {
        await msg.send(`${this.client.constants.EMOTES.loading}  ::  Loading story...`);
        const $ = cheerio.load(await fetch('http://www.fmylife.com/random').then(res => res.text())); // eslint-disable-line id-length

        const embed = new MessageEmbed()
            .setTitle(`Requested by ${msg.author.tag}`)
            .setAuthor('FML Stories')
            .setColor('RANDOM')
            .setTimestamp()
            .setDescription(`_${$('.article-contents .article-link').eq(0).text().trim()}\n\n_`)
            .addField('I agree, your life sucks:', $('.vote-brick').eq(1).text() || 'N/A', true)
            .addField('You deserved it:', $('.vote-brick').eq(3).text() || 'N/A', true);

        if ($('.article-contents .article-link').length < 5) {
            throw '<:akcry:333597917342466048>  ::  Today, something went wrong, so you will have to try again in a few moments. FML again.';
        }

        await msg.send({ embed });
    }

};
