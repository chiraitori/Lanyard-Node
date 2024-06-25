module.exports = {
    name: 'ping',
    description: 'Ping the bot to check if it is responsive',
    async execute(message, args) {
        const sent = await message.channel.send('Pinging...');
        sent.edit(`Pong! Round-trip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    }
};
