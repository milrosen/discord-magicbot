module.exports = {
	name: 'info',
	description: 'tells you about other commands',
	execute(message, args) {
		message.channel.send(`${message.author.username} just asked for info, wouldn't it be cool if this command did something?`);
	}
}