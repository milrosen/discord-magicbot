const {swapRoles} = require('../roleHelper.js');
module.exports = {
	name: 'revive',
	description: 'starts the arduous, blasphemous, and *lengthy* (10min) process of reviving yourself',
	execute (message, args, db) {
		const target = message.mentions.members.first();

		if (message.member.permissions.has('MANAGE_ROLES_OR_PERMISSIONS')) {
			target ? revive(target, target.id, db) : revive(message.member, message.author.id, db);
			return;
		}
		setTimeout(() => target ? revive(target, target.id, db) : revive(message.member, message.author.id, db));
	}
}

const revive = async (member, dsId, db) => {
	swapRoles(member, ['Dead'], 'Green');
	const users = db.collection('UserInfo');

	const updateDoc = {
		$set: {
			dead: false,
			hp: 100,
		}
	}
	await users.updateOne({
		dsId: dsId
	}, updateDoc, {});
}