const dontenv = require('dotenv');
dontenv.config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('ready');
});

client.login(process.env.TOKEN);

client.on('message', message => {
	console.log(message.content);
});

