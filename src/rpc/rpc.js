const package = require('../../package.json');
const config = require('../../config.json');
const logger = require('../utils/logger.js');
const chalk = require('chalk');
const axios = require('axios');

let firstTimeRunningRPC = true;
let startDate;

if (firstTimeRunningRPC) {
	startDate = Date.now();
} else {
	startDate = startDate;
};

const rpc = async function setActivity(client) {
	const response = await axios({
		method: 'GET',
		url: `https://api.clashroyale.com/v1/players/%23${config.settings.user.playerTag.replace('#', '')}`,
		headers: {
			'Authorization': `Bearer ${config.auth.clashroyale.token}`,
			'Content-Type': 'application/json',
			'User-Agent': `${package.name.toUpperCase()}/${package.version}`
		}
	}).catch(function (error) {
		if (error.response.status === 400) {
			console.error(logger.error + `The Client is providing incorrect parameters for the request. Report this at ${package.bugs.url} ! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 403 && error.response.data.reason === 'accessDenied') {
			console.error(logger.error + `You provided an invalid API key. Check if it is correct in the config file, or go to https://developer.clashroyale.com/#/new-key to create a new one. ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 403 && error.response.data.reason === 'accessDenied.invalidIp') {
			console.error(logger.error + `The API key does not allow access for your IP. Check if your IP is in the list of authorized IPs to access the API with your API key at https://developer.clashroyale.com/#/account. To check your IP, go to https://nordvpn.com/what-is-my-ip ! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 404) {
			console.error(logger.error + `You provided an invalid player tag. Check if it is correct in the config file. ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 429) {
			console.error(logger.error + `The API is at its maximum capacity. Please, try again later! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 500) {
			console.error(logger.error + `An unknown error happened when handling the request. Please, try again! If the error persists, please try again later! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else if (error.response.status === 503) {
			console.error(logger.error + `Clash Royale is currently under maintenance, so it is not possible to access the API. Wait for the maintenance to finish before you can access the API. ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		} else {
			console.error(logger.error + `An error has occurred. Report this at ${package.bugs.url} ! ${chalk.redBright(`[ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})]`)}`);

			process.exit(1);
		};
	});

	const player = await response.data;

	client.request('SET_ACTIVITY', {
		pid: process.pid,
		activity: {
			details: `⭐ Level: ${player.expLevel} • 🏆 Trophies: ${player.trophies}/${player.bestTrophies}`,
			state: `🛕 Arena: ${player.arena.name.substr(6)} • 🥊 Wins: ${player.wins}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: 'logo',
				large_text: `${package.name.toUpperCase()} v${package.version}`,
				small_image: 'player',
				small_text: `${player.name} (${player.tag})`
			},
			buttons: [
				{
					label: '🚀 Download',
					url: package.repository.url
				}
			]
		}
	}).catch(error => {
		if (error.message === 'RPC_CONNECTION_TIMEOUT') {
			console.error(logger.error + error);
	
			process.exit(1);
		};
	});
};

module.exports = {
	rpc
};