module.exports = {
    name: 'subscribe',
    description: 'Subscribe to notifications',
    async execute(message, args, db) {
        const globalSubscribers = db.collection('global_subscribers');
        const subscriber = { userId: message.author.id, channelId: message.channel.id };
        await globalSubscribers.insertOne(subscriber);
        message.channel.send('You are now subscribed!');
    }
};
