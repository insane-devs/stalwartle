const Stalwartle = require('./lib/structures/StalwartleClient');
const { config, token } = require('./config');

const client = new Stalwartle(config);

const main = async () => {
    try {
        client.logger.info('Logging in...');
        await client.login(token);
        client.logger.info('Sucessfully logged in.');
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

main();
