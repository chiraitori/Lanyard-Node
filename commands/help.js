module.exports = {
    name: 'help',
    description: 'List all available commands',
    async execute(message, args) {
        const { commands } = message.client;

        const commandList = commands.map(command => `\`${command.name}\`: ${command.description}`).join('\n');

        const embed = {
            color: 0x0099ff,
            title: 'Help - List of Commands',
            description: commandList,
            timestamp: new Date(),
        };

        message.channel.send({ embeds: [embed] });
    }
};
