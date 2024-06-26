module.exports = {
    name: 'unban',
    description: 'Unban a user from the server',
    async execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('You do not have permissions to use this command.');
        }

        const userId = args[0];
        if (!userId) {
            return message.reply('You need to specify a user ID to unban.');
        }

        try {
            await message.guild.members.unban(userId);
            message.channel.send(`User with ID ${userId} has been unbanned.`);
        } catch (error) {
            message.reply('Unable to unban the user. Please check the user ID and try again.');
        }
    }
};
