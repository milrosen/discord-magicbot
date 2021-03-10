const spellJSON = require('./info/spellinfo.json');
const {swapRoles, insertFromId} = require('../helperFunctions.js')

const generateFunnyDeathMessage = (wizard, victim, method) => {
	phrases = [
		`and lo, the foul ${victim} was banishèd to the cringe-cavens by the gallant ${wizard}`,
		`exclamation ${wizard}'s adjective ${method} death phrase`,
		`bereft of options, ${victim} simply had to watch as ${wizard}'s adjective ${method} death phrase`
	]

	deathPhrases = [
		`turned ${victim}'s innards into outers`,
		`convinced ${victim} that they simply had too much health`,
	]

	adjectives = [
		'very cool',
		'poggers',
		'unfathomably sexy',
		'(honestly kinda cringe)',
		'(kinda pathetic, but it feels weird to point out given the circumstances)'
	]

	exclamations = [
		'Pogchamp,',
		'Finally!',
		`Unfortunately for ${victim},`
	]

	const randIndex = (length) => {
		return Math.floor(Math.random() * length);
	}

	return phrases[randIndex(phrases.length)].replace(/adjective/g, adjectives[randIndex(adjectives.length)])
		.replace(/death phrase/g, deathPhrases[randIndex(deathPhrases.length)])
		.replace(/exclamation/g, exclamations[randIndex(exclamations.length)]);
}

module.exports = {
	name: 'cast',
	description: 'casts a spell',
	async execute(message, args, db) {
		if (message.member.roles.cache.has('dead')) return;
		const spellName = args[0];

		if (!(spellName in spellJSON || !spellName)) return message.channel.send(`Hey! @${message.author.username} ! Try casting a spell that exists nextime, wiseguy, use the \`!info\` command to see our availible spells, ok bub!`);

		const targetDs = message.mentions.users.first();
		if (!targetDs || targetDs.bot) return message.reply(`you gotta target *someone*, mention them after the name of the spell, ok?`);

		const users = db.collection('UserInfo');
		const spell = spellJSON[spellName];
		const caster = await insertFromId(message.author.id, users);
		const target = await insertFromId(targetDs.id, users);

		if (target.dead) return message.reply(`Stoooop.... nooooo he's already dead!1!!`);

		if (caster.mp < spell.cost) return message.reply(`${spellName} costs ${spell.cost}mp and you only have ${caster.mp}mp. HAHA ***broke!***`);

		const targetMember = message.mentions.members.first();

		typeof spell.damage === 'number' ? spell.damage = spell.damage : spell.damage = 0;

		const updateDocCaster = {
			$set: {
				mp: caster.mp - spell.cost,
			}
		}
		await users.updateOne({
			dsId: message.author.id
		}, updateDocCaster, {});
		
		if (target.hp <= spell.damage) {
			const updateDoc = {
				$set: {
					dead: true,
					hp: 0,
				}
			}
			await users.updateOne({
				dsId: targetDs.id
			}, updateDoc, {});
			swapRoles(targetMember, ["Red", "Yellow", "Green"], "Dead");
			return message.channel.send(generateFunnyDeathMessage(message.author.username, targetDs.username, spellName));
		}

		colorRole = target.hp - spell.damage <=25 ? "Red"
				  : target.hp - spell.damage <=50 ? "Yellow"
				  : "Green";

		swapRoles(targetMember, ["Red", "Yellow", "Green"], colorRole);
		message.reply(`casts ${spellName} targeting ${args[1]}, they only have ${target.hp - spell.damage}hp you have ${caster.mp - spell.cost}mp`);

		const updateDoc = {
			$set: {
				hp: target.hp - spell.damage,
			}
		}
		await users.updateOne({
			dsId: targetDs.id
		}, updateDoc, {});
	}
}