module.exports = {
    name: 'unsubscribe',
    description: 'Unsubscribe from notifications',
    async execute(message, args, db) {
        const globalSubscribers = db.collection('global_subscribers');
        const subscriber = { userId: message.author.id, channelId: message.channel.id };
        await globalSubscribers.deleteOne(subscriber);
        message.channel.send('You are now unsubscribed!');
    }
};
