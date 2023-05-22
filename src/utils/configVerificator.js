const config = require('../../config.js');

module.exports = {
	init: () => {
		function containsNumber(string) {
			return /\d/.test(string);
		};

		if (!config.auth.discord.clientID) {
			console.error('[HANDLER] No client ID provided. Please provide a client ID.');

			process.exit(1);
		};

		if (config.auth.discord.clientID && !containsNumber(config.auth.discord.clientID)) {
			console.error('[HANDLER] The client ID provided is not valid. Please provide a valid client ID.');

			process.exit(1);
		};

		if (config.auth.discord.clientID !== '844279952387866674') {
			console.error('[HANDLER] The client ID provided is not the CRRPC one. Please provide the CRRPC client ID by going to the config file and changing the clientID value to 844279952387866674');

			process.exit(1);
		};

		if (!config.auth.clashroyale.token || config.auth.clashroyale.token === 'YOUR API KEY') {
			console.error('[HANDLER] No Clash Royale API key provided. Please provide a Clash Royale API key.');

			process.exit(1);
		};

		if (!config.settings.user.playerTag || config.settings.user.playerTag === 'YOUR PLAYER TAG') {
			console.error('[HANDLER] No Clash Royale Player tag provided. Please provide a Clash Royale Player tag.');

			process.exit(1);
		};
	}
};