module.exports = {
    name: 'unsubscribe',
    description: 'Unsubscribe from a user\'s presence changes',
    async execute(message, args, db, logger) {
        try {
            const targetUserId = args[0];
            if (!targetUserId) {
                message.reply('You must specify a user ID to unsubscribe from.');
                return;
            }

            const notifyUserId = message.author.id;
            const presenceNotifications = db.collection('presence_notifications');
            await presenceNotifications.deleteOne({ notifyUserId, targetUserId });
            message.channel.send(`You are now unsubscribed from <@${targetUserId}>'s presence changes.`);
        } catch (error) {
            logger.error(`Error unsubscribing from presence changes: ${error}`);
            message.reply('There was an error unsubscribing from the presence changes.');
        }
    }
};
