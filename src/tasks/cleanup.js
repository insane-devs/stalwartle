const Task = require('../lib/structures/tasks/Task');
const { Util: { binaryToID } } = require('discord.js');

// THRESHOLD equals to 30 minutes in milliseconds:
//     - 1000 milliseconds = 1 second
//     - 60 seconds        = 1 minute
//     - 30 minutes
const THRESHOLD = 1000 * 60 * 30,
    EPOCH = 1420070400000,
    EMPTY = '0000100000000000000000';

module.exports = class MemorySweeper extends Task {

    constructor(...args) {
        super(...args);

        // The header with the console colors
        this.header = '[CACHE AND DATABASE CLEANUP]';
    }

    /* eslint complexity: ['warn', 30] */
    async run() {
        const OLD_SNOWFLAKE = binaryToID(((Date.now() - THRESHOLD) - EPOCH).toString(2).padStart(42, '0') + EMPTY);
        let guildMembers = 0,
            presences = 0,
            emojis = 0,
            // lastMessages = 0,
            modlogDBs = 0,
            musicDBs = 0,
            users = 0;

        // ----- CACHED DATA SWEEPERS ----- //

        // Per-Guild sweeper
        for (const guild of this.container.client.guilds.cache.values()) {
            // Clear presences
            presences += guild.presences.cache.size;
            guild.presences.cache.clear();

            // Clear members that haven't send a message in the last 30 minutes
            const { me } = guild;
            for (const [id, member] of guild.members.cache) {
                if ([me, guild.owner].includes(member)) continue;
                if (member.voice.channel) continue;
                if (member.lastMessageID && member.lastMessageID > OLD_SNOWFLAKE) continue;
                if (member.user.settings.get('cookies')) continue;
                guildMembers++;
                guild.members.cache.delete(id);
            }

            // Clear emojis
            emojis += guild.emojis.cache.size;
            guild.emojis.cache.clear();
        }

        // Per-Channel sweeper
        /* for (const channel of this.container.client.channels.cache.values()) {
			if (!channel.lastMessageID) continue;
			channel.lastMessageID = null;
			lastMessages++;
		} */

        // Per-User sweeper
        for (const user of this.container.client.users.cache.values()) {
            if (user.lastMessageID && user.lastMessageID > OLD_SNOWFLAKE) continue;
            if (user.settings.get('cookies')) continue;
            this.container.client.users.cache.delete(user.id);
            users++;
        }

        // Running garbage collection of Node.js
        // if (global.gc) global.gc();

        // ----- PERSISTENT DATA SWEEPERS ----- //

        // Music database sweeper
        for (const { history, id, playlist, queue } of await this.container.client.provider.getAll('music')) {
            if (history.length || playlist.length) continue;
            if (this.container.client.guilds.cache.has(id) && queue.length) continue;
            this.container.client.gateways.music.delete(id);
            musicDBs++;
        }

        // Modlog database sweeper
        for (const { id, modlogs } of await this.container.client.provider.getAll('modlogs')) {
            if (modlogs.length) continue;
            this.container.client.gateways.modlogs.delete(id);
            modlogDBs++;
        }

        // Emit a log
        this.container.client.emit('log', [
            this.header,
            `${guildMembers} [GuildMember]s`,
            `${users} [User]s`,
            // `${lastMessages} [Last Message]s`,
            `${presences} [Presence]s`,
            `${emojis} [Emoji]s`,
            `${musicDBs} [MusicDB]s`,
            `${modlogDBs} [ModlogDB]s`
        ].join('\n'));
    }

    async init() {
        this.run();
    }

};
