module.exports = {
    name: 'presence',
    description: 'Log user presence status',
    async execute(message, args, db) {
        const status = args.join(' ');
        const cachedPresences = db.collection('cached_presences');
        const presenceData = {
            userId: message.author.id,
            status: status,
            timestamp: new Date()
        };
        await cachedPresences.insertOne(presenceData);
        message.channel.send('Presence status updated!');
    }
};
