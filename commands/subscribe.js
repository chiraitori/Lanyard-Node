module.exports = {
    name: 'subscribe',
    description: 'Subscribe to a user\'s presence changes',
    async execute(message, args, db, logger) {
        try {
            const targetUserId = args[0];
            if (!targetUserId) {
                message.reply('You must specify a user ID to subscribe to.');
                return;
            }

            const notifyUserId = message.author.id;
            const presenceNotifications = db.collection('presence_notifications');
            await presenceNotifications.updateOne(
                { notifyUserId, targetUserId },
                { $set: { notifyUserId, targetUserId } },
                { upsert: true }
            );
            message.channel.send(`You are now subscribed to <@${targetUserId}>'s presence changes.`);
        } catch (error) {
            logger.error(`Error subscribing to presence changes: ${error}`);
            message.reply('There was an error subscribing to the presence changes.');
        }
    }
};
