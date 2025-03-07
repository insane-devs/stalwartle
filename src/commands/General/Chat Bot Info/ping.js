const { Command, container } = require('@sapphire/framework');
const { reply } = container;

module.exports = class extends Command {

    constructor(context, options) {
        super(context, {
            ...options,
            description: "Displays the bot's latency in terms of a ping-pong game. API latency is the ping for the Discord's API so please ignore that."
        });
        this.guarded = true;
    }

    async messageRun(msg) {
        const message = await reply(msg, `🏓  ::  **Pong!**`);
        reply(msg, `🏓  ::  **Pong!** Ping pong game ended! 😃 ~~(I won)~~ | Game Duration: **${(message.editedTimestamp || message.createdTimestamp) -
			(msg.editedTimestamp || msg.createdTimestamp)}ms**. API Latency: **${Math.round(this.container.client.ws.ping)}ms**.`);
    }

};
