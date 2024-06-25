module.exports = {
    name: 'log',
    description: 'Log a message',
    async execute(message, args, db) {
        const logMessage = args.join(' ');
        const analytics = db.collection('analytics');
        await analytics.insertOne({ message: logMessage, timestamp: new Date() });
        message.channel.send('Message logged!');
    }
};
