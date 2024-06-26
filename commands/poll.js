module.exports = {
    name: 'poll',
    description: 'Create a poll',
    async execute(message, args) {
        const pollDescription = args.join(' ');
        if (!pollDescription) {
            return message.reply('You need to provide a poll description.');
        }

        const embed = {
            color: 0x0099ff,
            title: 'Poll',
            description: pollDescription,
            timestamp: new Date(),
        };

        const pollMessage = await message.channel.send({ embeds: [embed] });
        await pollMessage.react('👍');
        await pollMessage.react('👎');
    }
};
