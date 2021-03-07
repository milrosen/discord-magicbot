const dontenv = require('dotenv');
dontenv.config();
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
	const command = require(`./commands/${file}`)

	client.commands.set(command.name, command);
})

client.once('ready', () => {
	console.log('ready');
});

client.login(process.env.TOKEN);

client.on('message', message => {
	const content = message.content;
	if (!content.startsWith('!') || message.author.bot) return;

	const args = content.slice(1).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('if there were competent coders working on me, that would\'ve done something');
	}
});



