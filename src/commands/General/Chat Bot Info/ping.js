const { Command } = require('@sapphire/framework');
const { send } = require('@sapphire/plugin-editable-commands');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            guarded: true,
            description: "Displays the bot's latency in terms of a ping-pong game. API latency is the ping for the Discord's API so please ignore that."
        });
    }

    async messageRun(msg) {
        const message = await send(msg, `🏓  ::  **Pong!**`);
        send(msg, `🏓  ::  **Pong!** Ping pong game ended! 😃 ~~(I won)~~ | Game Duration: **${(message.editedTimestamp || message.createdTimestamp) -
			(msg.editedTimestamp || msg.createdTimestamp)}ms**. API Latency: **${Math.round(this.container.client.ws.ping)}ms**.`);
    }

};
