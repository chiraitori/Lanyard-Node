const { isOwner } = require('../utils/checkOwner');
const { isAdmin } = require('../utils/checkAdmin');

module.exports = {
    name: 'mute',
    description: 'Mute a user in the server',
    async execute(message, args) {
        if (!isOwner(message.author.id) && !isAdmin(message.member)) {
            return message.reply('You do not have permissions to use this command.');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('You need to mention a user to mute.');
        }

        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('User not found in this server.');
        }

        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return message.reply('Mute role not found. Please create a role named "Muted" with appropriate permissions.');
        }

        await member.roles.add(muteRole);
        message.channel.send(`${user.tag} has been muted.`);
    }
};
