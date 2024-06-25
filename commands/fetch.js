const { handleError } = require('../utils/errorHandler');

module.exports = {
    name: 'fetch',
    description: 'Fetch logged messages',
    async execute(message, args, db, logger) {
        try {
            const analytics = db.collection('analytics');
            const data = await analytics.find().toArray();
            message.channel.send(`Logged messages: ${data.map(item => item.message).join(', ')}`);
        } catch (error) {
            handleError(message, error, logger);
        }
    }
};
