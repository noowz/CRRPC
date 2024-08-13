const { auth, settings } = require("../config.json");
const { logErrorAndExit, getNumberInString } = require("./utils.js");

const CRRPC_CLIENT_ID = "844279952387866674";

async function verifyConfig() {
	if (!auth.discord.client_id) {
		logErrorAndExit("No Discord client ID provided. Please update the 'client_id' field in the config file with your Discord client ID.");
	} else if (!getNumberInString(auth.discord.client_id)) {
		logErrorAndExit("The provided Discord client ID is invalid. Ensure the 'client_id' field in the config file contains a valid numeric ID.");
	} else if (auth.discord.client_id !== CRRPC_CLIENT_ID) {
		logErrorAndExit(`The provided Discord client ID does not match the required CRRPC client ID. Update the 'client_id' field in the config file to ${CRRPC_CLIENT_ID}.`);
	};

	if (!auth.clashroyale.token || auth.clashroyale.token === "YOUR API KEY") {
		logErrorAndExit("No Clash Royale API key provided. Please update the 'token' field in the config file with your Clash Royale API key.");
	};

	if (!settings.user.player_tag || settings.user.player_tag === "YOUR PLAYER TAG") {
		logErrorAndExit("No Clash Royale player tag provided. Please update the 'player_tag' field in the config file with your Clash Royale player tag.");
	};
};

module.exports = { verifyConfig };