module.exports = {
	swapRoles(member, rolesToSwapFrom, roleToAdd) {
		const rolesToNotChange = Array.from(member.roles.cache.values()).filter(role => !rolesToSwapFrom.includes(role.name));
		const newRole = member.guild.roles.cache.find(role => role.name === roleToAdd);
		member.roles.set([...rolesToNotChange, newRole]);
	},

	async insertFromId (id, users) {
		const user = await users.findOne({
			dsId: id
		}, {});
		const defaultUser = {
			dsId: id,
			hp: 100,
			mp: 0,
			dead: false,
		}
	
		if (user) return user;
	
		return users.insertOne(defaultUser);
	}
}