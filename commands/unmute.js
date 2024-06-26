const { isOwner } = require('../utils/checkOwner');
const { isAdmin } = require('../utils/checkAdmin');

module.exports = {
    name: 'unmute',
    description: 'Unmute a user in the server',
    async execute(message, args) {
        if (!isOwner(message.author.id) && !isAdmin(message.member)) {
            return message.reply('You do not have permissions to use this command.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('You need to mention a user to unmute.');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('User not found in this server.');
        }

        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return message.reply('Mute role not found.');
        }

        await member.roles.remove(muteRole);
        message.channel.send(`${user.tag} has been unmuted.`);
    }
};
