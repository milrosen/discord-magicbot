const spellJSON = require('./info/spellinfo.json');

module.exports = {
	name: 'cast',
	description: 'casts a spell',
	execute(message, args) {
		if (!args[0] in spellJSON || !args[0]) {
			message.channel.send(`Hey! ${message.author.username}! Try casting a spell that exists nextime, wiseguy, use the \`!info\` command to see our availible spells, ok bub!`);
			return;
		}
		if (!args[1]) {
			message.reply(`you gotta target someone, put their username after the name of the spell, ok?`);
			return;
		}
		message.reply(`casts ${args[0]} targeting ${args[1]}`);
	}
}