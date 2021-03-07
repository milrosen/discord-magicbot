module.exports = {
	name: 'cast',
	description: 'casts a spell',
	execute(message, args) {
		message.channel.send(`@${message.author.username} said ${message.content}`);
	}
}