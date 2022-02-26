const Stalwartle = require('./lib/structures/StalwartleClient');
const { config, token } = require('./config');

// Instantiate Stalwartle
const client = new Stalwartle(config);

const main = async () => {
    try {
        client.logger.info('Logging in...');
        await client.login(token);
        client.logger.info('Successfully logged in.');
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

main();
