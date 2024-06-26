const { isOwner } = require('../utils/checkOwner');

module.exports = {
    name: 'prune',
    description: 'Delete a specified number of messages from the channel',
    async execute(message, args) {
        if (!isOwner(message.author.id) && !message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permissions to use this command.');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return message.reply('Please enter a number between 1 and 100.');
        }

        await message.channel.bulkDelete(amount, true);
        message.channel.send(`Deleted ${amount} messages.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    }
};
