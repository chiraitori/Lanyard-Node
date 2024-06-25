module.exports = {
    name: 'log',
    description: 'Log a message',
    async execute(message, args, db, logger) {
        try {
            const logMessage = args.join(' ');
            const analytics = db.collection('analytics');
            await analytics.insertOne({ message: logMessage, timestamp: new Date() });
            message.channel.send('Message logged!');
        } catch (error) {
            logger.error(`Error logging message: ${error}`);
            message.reply('There was an error logging the message.');
        }
    }
};
