module.exports = {
    name: 'notify',
    description: 'Notify subscribed users of an event',
    async execute(message, args, db) {
        const globalSubscribers = db.collection('global_subscribers');
        const subscribers = await globalSubscribers.find().toArray();

        const notification = args.join(' ');
        for (const subscriber of subscribers) {
            const user = await message.client.users.fetch(subscriber.userId);
            user.send(`Notification: ${notification}`);
        }
        message.channel.send('Subscribers have been notified!');
    }
};
