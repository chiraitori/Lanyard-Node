module.exports = {
    name: 'fetch',
    description: 'Fetch logged messages',
    async execute(message, args, db) {
        const analytics = db.collection('analytics');
        const data = await analytics.find().toArray();
        message.channel.send(`Logged messages: ${data.map(item => item.message).join(', ')}`);
    }
};
