module.exports = {
	swapRoles(member, rolesToSwapFrom, roleToAdd) {
		const rolesToNotChange = Array.from(member.roles.cache.values()).filter(role => !rolesToSwapFrom.includes(role.name));
		const newRole = member.guild.roles.cache.find(role => role.name === roleToAdd);
		member.roles.set([...rolesToNotChange, newRole]);
	}
}