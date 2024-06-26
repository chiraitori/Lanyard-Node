const { isOwner } = require('../utils/checkOwner');
const { isAdmin } = require('../utils/checkAdmin');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    async execute(message, args) {
        if (!isOwner(message.author.id) && !isAdmin(message.member)) {
            return message.reply('You do not have permissions to use this command.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('You need to mention a user to kick.');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('User not found in this server.');
        }

        await member.kick(args.slice(1).join(' ') || 'No reason provided');
        message.channel.send(`${user.tag} has been kicked.`);
    }
};
