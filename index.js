const dontenv = require('dotenv');
dontenv.config();
const fs = require('fs');

const { MongoClient } = require('mongodb');
const url = `mongodb+srv://milrosen:${process.env.MONGOPASS}@cluster0.vrxm7.mongodb.net/admin?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(url);

async function run() {
    try {
        await mongoClient.connect();
        console.log("Connected correctly to server");
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await mongoClient.close();
    }
}
run().catch(console.dir);

const Discord = require('discord.js');
const disClient = new Discord.Client();
disClient.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
	const command = require(`./commands/${file}`)

	disClient.commands.set(command.name, command);
})

disClient.once('ready', () => {
	console.log('ready');
});

disClient.login(process.env.TOKEN);

disClient.on('message', message => {
	const content = message.content;
	if (!content.startsWith('!') || message.author.bot) return;

	const args = content.slice(1).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!disClient.commands.has(command)) return;
	try {
		disClient.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('if there were competent coders working on me, that would\'ve done something');
	}
});



