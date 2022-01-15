const { Listener, Events } = require('@sapphire/framework');

const statuses = [
    { name: 'dead', type: 'PLAYING' },
    { name: 'with your feelings', type: 'PLAYING' },
    { name: 'with sparkling 🔥', type: 'PLAYING' },
    { name: 'hide and seek', type: 'PLAYING' },
    { name: 'bad code', type: 'LISTENING' },
    { name: 'with magic', type: 'PLAYING' },
    { name: 'Cops and Robbers', type: 'PLAYING' },
    { name: 'Simon Says', type: 'PLAYING' },
    { name: 'I Spy', type: 'PLAYING' },
    { name: 'chess', type: 'PLAYING' },
    { name: 'with a rubber duck', type: 'PLAYING' },
    { name: 'your movements', type: 'WATCHING' },
    { name: 'Stranger Things', type: 'WATCHING' },
    { name: 'Gravity Falls', type: 'WATCHING' },
    { name: 'anime', type: 'WATCHING' },
    { name: 'Spotify', type: 'LISTENING' },
    { name: 'Pop Rock', type: 'LISTENING' },
    { name: 'P!ATD', type: 'LISTENING' },
    { name: 'Fall Out Boy', type: 'LISTENING' },
    { name: 'Ariana Grande', type: 'LISTENING' }
];

module.exports = class extends Listener {

    constructor(...args) {
        super(...args, { event: Events.ClientReady, once: true });
    }

    async run() {
        await this.container.schedule.init();
        if (this.container.client.application.botPublic) this.container.client.postStats().then(() => this.container.client.setInterval(() => this.container.client.postStats(), 1000 * 60 * 5));
        this.container.client.user.setActivity('Just started running! 👀', { type: 'WATCHING' }).then(() => {
            this.container.client.setInterval(() => {
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                this.container.client.user.setActivity(`${status.name} | ${this.container.client.options.prefix}help`, { type: status.type });
            }, 60000);
        });
    }

};
