const {
	swapRoles
} = require('../roleHelper.js');
const Discord = require('discord.js');

module.exports = {
	name: 'revive',
	description: 'starts the arduous, blasphemous, and *lengthy* (10min) process of reviving yourself',
	execute(message, args, db) {
		const target = message.mentions.members.first();
		const personToRevive = target || message.member;
		const timers = message.client.reviveTimers;

		if (message.member.permissions.has('MANAGE_ROLES')) {
			revive(personToRevive, db)
			timers.delete(personToRevive.id);
			return;
		}

		const timeToRevive = 1000 * 60 * 10;
		const now = Date.now();
		if (timers.has(personToRevive.id)) {
			const expirationTime = timers.get(personToRevive.id) + timeToRevive;
			const timeLeft = (expirationTime - now) / 1000 / 60;
			const seconds = ((expirationTime - now) / 1000) % 60;
			const formattedSeconds = Math.floor(seconds).toString().length == 1 ? '0' + Math.floor(seconds) : Math.floor(seconds);
			return message.channel.send(`${personToRevive.user.username} still has ${Math.floor(timeLeft)}:${formattedSeconds}s left`)
		}
		message.reply('working on it, should only be 10 minutes now boss');
		console.log(timers.array());
		timers.set(personToRevive.id, now);
		setTimeout(() => {
			revive(personToRevive, db);
			timers.delete(personToRevive.id);
		}, timeToRevive);
	}
}

const revive = async (member, db) => {
	if (member.roles.cache.some(r => ["Red", "Yellow", "Green"].includes(r.name))) return;
	swapRoles(member, ['Dead'], 'Green');
	const users = db.collection('UserInfo');

	const updateDoc = {
		$set: {
			dead: false,
			hp: 100,
		}
	}
	await users.updateOne({
		dsId: member.id
	}, updateDoc, {});
}