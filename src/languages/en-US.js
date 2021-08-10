const { Language, util } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',
			PREFIX_REMINDER: (prefix = `@${this.client.user.tag}`) => `The prefix${Array.isArray(prefix) ?
				`es for this server are: ${prefix.map(pre => `\`${pre}\``).join(', ')}` :
				` in this server is set to: \`${prefix}\``
			}`,
			SETTING_GATEWAY_EXPECTS_GUILD: `${this.client.constants.EMOTES.xmark}  ::  The parameter <Guild> expects either a Guild or a Guild Object.`,
			SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `${this.client.constants.EMOTES.xmark}  ::  The value ${data} for the key ${key} does not exist.`,
			SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `${this.client.constants.EMOTES.xmark}  ::  The value ${data} for the key ${key} already exists.`,
			SETTING_GATEWAY_SPECIFY_VALUE: `${this.client.constants.EMOTES.xmark}  ::  You must specify the value to add or filter.`,
			SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `${this.client.constants.EMOTES.xmark}  ::  The key ${key} is not an Array.`,
			SETTING_GATEWAY_KEY_NOEXT: (key) => `${this.client.constants.EMOTES.xmark}  ::  The key ${key} does not exist in the current data schema.`,
			SETTING_GATEWAY_INVALID_TYPE: `${this.client.constants.EMOTES.xmark}  ::  The type parameter must be either \`add\` or \`remove\`.`,
			SETTING_GATEWAY_INVALID_FILTERED_VALUE: (piece, value) => `**${piece.key}** doesn't accept the value: ${value}`,
			RESOLVER_MULTI_TOO_FEW: (name, min = 1) => `${this.client.constants.EMOTES.xmark}  ::  Provided too few ${name}s. At least ${min} ${min === 1 ? 'is' : 'are'} required.`,
			RESOLVER_INVALID_BOOL: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be true or false.`,
			RESOLVER_INVALID_CHANNEL: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a channel tag or valid channel ID.`,
			RESOLVER_INVALID_CUSTOM: (name, type) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid ${type}.`,
			RESOLVER_INVALID_DATE: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid date.`,
			RESOLVER_INVALID_DURATION: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid duration string.`,
			RESOLVER_INVALID_EMOJI: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a custom emoji tag or valid emoji ID.`,
			RESOLVER_INVALID_FLOAT: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid number.`,
			RESOLVER_INVALID_GUILD: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid server ID.`,
			RESOLVER_INVALID_INT: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be an integer.`,
			RESOLVER_INVALID_LITERAL: (name) => `${this.client.constants.EMOTES.xmark}  ::  Your option did not match the only possibility: \`${name}\``,
			RESOLVER_INVALID_MEMBER: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a mention or valid user ID from this server.`,
			RESOLVER_INVALID_MESSAGE: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid message ID.`,
			RESOLVER_INVALID_PIECE: (name, piece) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid ${piece} name.`,
			RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must follow this regex pattern: \`${pattern}\`.`,
			RESOLVER_INVALID_ROLE: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a role mention or role ID.`,
			RESOLVER_INVALID_STRING: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid string.`,
			RESOLVER_INVALID_TIME: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid duration or date string.`,
			RESOLVER_INVALID_URL: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a valid URL.`,
			RESOLVER_INVALID_USER: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be a mention or valid user ID.`,
			RESOLVER_STRING_SUFFIX: ' characters',
			RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be exactly ${min}${suffix}.`,
			RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be between ${min} and ${max}${suffix}.`,
			RESOLVER_MINMAX_MIN: (name, min, suffix) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be greater than or equal to ${min}${suffix}.`,
			RESOLVER_MINMAX_MAX: (name, max, suffix) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` must be less than or equal to ${max}${suffix}.`,
			REACTIONHANDLER_PROMPT: '🎚  ::  Which page would you like to jump to?',
			COMMANDMESSAGE_MISSING: `${this.client.constants.EMOTES.xmark}  ::  Missing one or more required arguments after end of input.`,
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${this.client.constants.EMOTES.xmark}  ::  \`${name}\` is a required argument. Run \`s.help\` for more information.`,
			COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `${this.client.constants.EMOTES.xmark}  ::  A required option is missing. Run \`s.help <command>\` for more info: (${possibles})`,
			COMMANDMESSAGE_NOMATCH: (possibles) => `${this.client.constants.EMOTES.xmark}  ::  Your option didn't match any of the possibilities: (${possibles})`,
			MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time, abortOptions) => `${tag} | **${error}** | You have **${time}** seconds to respond to this prompt with a valid argument. Type **${abortOptions.join('**, **')}** to abort this prompt.`, // eslint-disable-line max-len
			MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time, cancelOptions) => `${tag} | **${name}** is a repeating argument | You have **${time}** seconds to respond to this prompt with additional valid arguments. Type **${cancelOptions.join('**, **')}** to cancel this prompt.`, // eslint-disable-line max-len
			MONITOR_COMMAND_HANDLER_ABORTED: `${this.client.constants.EMOTES.tick}  ::  Aborted`,
			MONITOR_COMMAND_HANDLER_POSSIBILITIES: ['abort', 'stop'],
			MONITOR_COMMAND_HANDLER_REPEATING_POSSIBILITIES: ['cancel'],
			INHIBITOR_COOLDOWN: (remaining) => `${this.client.constants.EMOTES.xmark}  ::  Please wait ${remaining} second${remaining === 1 ? '' : 's'} before reusing this command.`,
			INHIBITOR_DISABLED_GUILD: `${this.client.constants.EMOTES.xmark}  ::  This command has been disabled by an admin in this server.`,
			INHIBITOR_DISABLED_GLOBAL: `${this.client.constants.EMOTES.xmark}  ::  This command has been globally disabled by a bot owner.`,
			INHIBITOR_MISSING_BOT_PERMS: (missing) => `${this.client.constants.EMOTES.xmark}  ::  Insufficient permissions. Missing: **${missing}**`,
			INHIBITOR_NSFW: `${this.client.constants.EMOTES.xmark}  ::  You can only use NSFW commands in NSFW channels.`,
			INHIBITOR_PERMISSIONS: `${this.client.constants.EMOTES.xmark}  ::  You do not have permission to use this command.`,
			INHIBITOR_REQUIRED_SETTINGS: (settings) => `${this.client.constants.EMOTES.xmark}  ::  The server is missing the **${settings.join(', ')}** server setting${settings.length !== 1 ? 's' : ''} and thus the command cannot run.`, // eslint-disable-line max-len
			INHIBITOR_RUNIN: (types) => `${this.client.constants.EMOTES.xmark}  ::  This command is only available in ${types} channels.`,
			INHIBITOR_RUNIN_NONE: (name) => `${this.client.constants.EMOTES.xmark}  ::  The \`${name}\` command is not configured to run in any channel.`,
			COMMAND_BLACKLIST_DESCRIPTION: 'Blacklists or un-blacklists users and guilds from the bot.',
			COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
				usersAdded.length ? `**Users Added**\n${util.codeBlock('', usersAdded.join(', '))}` : '',
				usersRemoved.length ? `**Users Removed**\n${util.codeBlock('', usersRemoved.join(', '))}` : '',
				guildsAdded.length ? `**Guilds Added**\n${util.codeBlock('', guildsAdded.join(', '))}` : '',
				guildsRemoved.length ? `**Guilds Removed**\n${util.codeBlock('', guildsRemoved.join(', '))}` : ''
			].filter(val => val !== '').join('\n'),
			COMMAND_EVAL_DESCRIPTION: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
			COMMAND_EVAL_EXTENDEDHELP: [
				'The eval command evaluates code as-in, any error thrown from it will be handled.',
				'It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.',
				'The --silent flag will make it output nothing.',
				"The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.",
				'The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword.',
				'The --showHidden flag will enable the showHidden option in util.inspect.',
				'If the output is too large, it\'ll send the output as a file, or in the console if the bot does not have the ATTACH_FILES permission.'
			].join('\n'),
			COMMAND_EVAL_ERROR: (time, output) => `**Error**:${output}\n${time}`,
			COMMAND_EVAL_OUTPUT: (time, output) => `**Output**:${output}\n${time}`,
			COMMAND_EVAL_OUTPUT_CONSOLE: (time) => `Sent the result to console.\n${time}`,
			COMMAND_EVAL_OUTPUT_FILE: (time) => `Sent the result as a file.\n${time}`,
			COMMAND_EVAL_OUTPUT_HASTEBIN: (time, url) => `Sent the result to hastebin: ${url}\n${time}\n`,
			COMMAND_EVAL_SENDFILE: (time) => `Output was too long... sent the result as a file.\n${time}`,
			COMMAND_EVAL_SENDCONSOLE: (time) => `Output was too long... sent the result to console.\n${time}`,
			COMMAND_EVAL_TIMEOUT: (seconds) => `TIMEOUT: Took longer than ${seconds} seconds.`,
			COMMAND_UNLOAD: (type, name) => `${this.client.constants.EMOTES.tick}  ::  Unloaded ${type}: \`${name}\``,
			COMMAND_UNLOAD_DESCRIPTION: 'Unloads the klasa piece.',
			COMMAND_UNLOAD_WARN: 'You probably don\'t want to unload that, since you wouldn\'t be able to run any command to enable it again.',
			COMMAND_TRANSFER_ERROR: 'That file has been transfered already or never existed.',
			COMMAND_TRANSFER_SUCCESS: (type, name) => `${this.client.constants.EMOTES.tick}  ::  Successfully transferred ${type}: \`${name}\`.`,
			COMMAND_TRANSFER_FAILED: (type, name) => `${this.client.constants.EMOTES.xmark}  ::  Transfer of ${type}: \`${name}\` to Client has failed. Please check your Console.`,
			COMMAND_TRANSFER_DESCRIPTION: 'Transfers a core piece to its respective folder.',
			COMMAND_RELOAD: (type, name, time) => `${this.client.constants.EMOTES.tick}  ::  Reloaded ${type}: \`${name}\` (Took ${time})`,
			COMMAND_RELOAD_FAILED: (type, name) => `${this.client.constants.EMOTES.xmark}  ::  Failed to reload ${type}: \`${name}\`. Please check your console.`,
			COMMAND_RELOAD_ALL: (type, time) => `${this.client.constants.EMOTES.tick}  ::  Reloaded all ${type}. (Took ${time})`,
			COMMAND_RELOAD_EVERYTHING: (time) => `${this.client.constants.EMOTES.tick}  ::  Reloaded everything. (Took ${time})`,
			COMMAND_RELOAD_DESCRIPTION: 'Reloads a klasa piece, or all pieces of a klasa store.',
			COMMAND_REBOOT: `${this.client.constants.EMOTES.loading}  ::  Bot is restarting... I will message you in this channel once I've woken up again.`,
			COMMAND_REBOOT_DESCRIPTION: 'Reboots the bot.',
			COMMAND_LOAD: (time, type, name) => `${this.client.constants.EMOTES.tick}  ::  Successfully loaded ${type}: \`${name}\`. (Took: ${time})`,
			COMMAND_LOAD_FAIL: `${this.client.constants.EMOTES.xmark}  ::  The file does not exist, or an error occurred while loading your file. Please check your console.`,
			COMMAND_LOAD_ERROR: (type, name, error) => `${this.client.constants.EMOTES.xmark}  ::  Failed to load ${type}: \`${name}\`. Reason:${util.codeBlock('js', error)}`,
			COMMAND_LOAD_DESCRIPTION: 'Load a piece from your bot.',
			COMMAND_PING: 'Ping?',
			COMMAND_PING_DESCRIPTION: 'Runs a connection test to Discord.',
			COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,
			COMMAND_INVITE: () => [
				`To add ${this.client.user.username} to your Discord server:`,
				`<${this.client.invite}>`,
				util.codeBlock('', [
					'The above link is generated requesting the minimum permissions required to use every command currently.',
					'I know not all permissions are right for every server, so don\'t be afraid to uncheck any of the boxes.',
					'If you try to use a command that requires more permissions than I am granted, I\'ll let you know.'
				].join(' ')),
				'Please use the `s.bug` command if you find any bugs.'
			],
			COMMAND_INVITE_DESCRIPTION: 'Displays the join server link of the bot.',
			COMMAND_INFO: [
				"Klasa is a 'plug-and-play' framework built on top of the Discord.js library.",
				'Most of the code is modularized, which allows developers to edit Klasa to suit their needs.',
				'',
				'Some features of Klasa include:',
				'• 🐇💨 Fast loading times with ES2017 support (`async`/`await`)',
				'• 🎚🎛 Per-client/server/user settings that can be extended with your own fields',
				'• 💬 Customizable command system with automated parameter resolving and the ability to load/reload commands on-the-fly',
				'• 👀 "Monitors", which can watch messages and edits (for swear filters, spam protection, etc.)',
				'• ⛔ "Inhibitors", which can prevent commands from running based on any condition you wish to apply (for permissions, blacklists, etc.)',
				'• 🗄 "Providers", which simplify usage of any database of your choosing',
				`• ${this.client.constants.EMOTES.tick}  "Finalizers", which run after successful commands (for logging, collecting stats, cleaning up responses, etc.)`,
				'• ➕ "Extendables", which passively add methods, getters/setters, or static properties to existing Discord.js or Klasa classes',
				'• 🌐 "Languages", which allow you to localize your bot\'s responses',
				'• ⏲ "Tasks", which can be scheduled to run in the future, optionally repeating',
				'',
				'We hope to be a 100% customizable framework that can cater to all audiences. We do frequent updates and bugfixes when available.',
				"If you're interested in us, check us out at https://klasa.js.org"
			],
			COMMAND_INFO_DESCRIPTION: 'Provides some information about this bot.',
			COMMAND_HELP_DESCRIPTION: 'Display help for a command.',
			COMMAND_HELP_NO_EXTENDED: 'No extended help available.',
			COMMAND_HELP_DM: '📬  ::  The bot does not have **Embed**, **Manage Messages** and/or **Add Reactions** Permissions, but the list of commands you have access to has been sent to your DMs.',
			COMMAND_HELP_NODM: `${this.client.constants.EMOTES.xmark}  ::  You have DMs disabled, I couldn't send you the commands in DMs.`,
			COMMAND_HELP_USAGE: (usage) => `Usage :: ${usage}`,
			COMMAND_HELP_EXTENDED: 'Extended Help ::',
			COMMAND_ENABLE: (type, name) => `Successfully enabled ${type}: ${name}`,
			COMMAND_ENABLE_DESCRIPTION: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',
			COMMAND_DISABLE: (type, name) => `Successfully disabled ${type}: ${name}`,
			COMMAND_DISABLE_DESCRIPTION: 'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',
			COMMAND_DISABLE_WARN: `${this.client.constants.EMOTES.xmark}  ::  You probably don't want to disable that, since you wouldn't be able to run any command to enable it again.`,
			COMMAND_CONF_NOKEY: `${this.client.constants.EMOTES.xmark}  ::  You must provide a key.`,
			COMMAND_CONF_NOVALUE: `${this.client.constants.EMOTES.xmark}  ::  You must provide a value.`,
			COMMAND_CONF_GUARDED: (name) => `${this.client.constants.EMOTES.xmark}  ::  ${util.toTitleCase(name)} may not be disabled.`,
			COMMAND_CONF_UPDATED: (key, response) => `${this.client.constants.EMOTES.tick}  ::  Successfully updated the key **${key}**: \`${response}\``,
			COMMAND_CONF_KEY_NOT_ARRAY: `${this.client.constants.EMOTES.xmark}  ::  This key is not array type. Use the action \`reset\` instead.`,
			COMMAND_CONF_GET_NOEXT: (key) => `${this.client.constants.EMOTES.xmark}  ::  The key **${key}** does not seem to exist.`,
			COMMAND_CONF_GET: (key, value) => `The value for the key **${key}** is: \`${value}\``,
			COMMAND_CONF_RESET: (key, response) => `${this.client.constants.EMOTES.tick}  ::  The key **${key}** has been reset to: \`${response}\``,
			COMMAND_CONF_NOCHANGE: (key) => `${this.client.constants.EMOTES.xmark}  ::  The value for **${key}** was already that value.`,
			COMMAND_CONF_SERVER_DESCRIPTION: 'Define per-server settings.',
			COMMAND_CONF_SERVER: (key, list) => `**Server Settings${key}**\n${list}`,
			COMMAND_CONF_USER_DESCRIPTION: 'Define per-user settings.',
			COMMAND_CONF_USER: (key, list) => `**User Settings${key}**\n${list}`,
			COMMAND_STATS: (memUsage, uptime, users, servers, channels, klasaVersion, discordVersion, processVersion, msg) => [
				'= STATISTICS =',
				'',
				`• Mem Usage  :: ${memUsage} MB`,
				`• Uptime     :: ${uptime}`,
				`• Users      :: ${users}`,
				`• Servers    :: ${servers}`,
				`• Channels   :: ${channels}`,
				`• Klasa      :: v${klasaVersion}`,
				`• Discord.js :: v${discordVersion}`,
				`• Node.js    :: ${processVersion}`,
				this.client.options.shardCount ? `• Shard      :: ${((msg.guild ? msg.guild.shardID : msg.channel.shardID) || this.client.options.shardId) + 1} / ${this.client.options.shardCount}` : ''
			],
			COMMAND_STATS_DESCRIPTION: 'Provides some details about the bot and stats.',
			MESSAGE_PROMPT_TIMEOUT: 'The prompt has timed out.'
		};
	}

	async init() {
		await super.init();
	}

};
