const spellJSON = require('./info/spellinfo.json');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];
commandFiles.forEach(file => {
	if (file == 'info.js') return;
	const command = require(`./${file}`);
	commands.push(command);
})

const spellInfo = (message) => {
	message.channel.send(`Here are the super cool spells that you could be casting rn:
	${Object.entries(spellJSON).map(spell => `**${spell[0]}**: *${Object.entries(spell[1])[0][1]}*
		Damage: ${Object.entries(spell[1])[1][1]}
		Cost: ${Object.entries(spell[1])[2][1]}gp
	`)}`.replace(/,/g, ''));
	// note, this is bad code. I cannot figure out where the commas infront of the spell names are coming from. This will be temporary
}

module.exports = {
	name: 'info',
	description: 'tells you about other commands',
	execute(message, args) {
		if (/spells?/.test(args[0])) return spellInfo(message);

		const filter = (reaction, user) => {
			return reaction.emoji.name === '✨' && user.id === message.author.id;
		};
		
		message.channel.send(`thanks for asking for info, some really, really cooool commands you can use are:
		${commands.map((command) => `${command.name}: ${command.description}
		`)}
		click on the ✨ to learn more about some of the spells you could be casting!`).then(message => {
			message.react('✨');
			const collector = message.createReactionCollector(filter, { time: 1500 });

			collector.on('collect', () => spellInfo(message));
		});
	}
}