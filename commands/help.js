module.exports = {
    name: 'help',
    description: 'List all available commands',
    async execute(message, args, db, logger) {
        const commands = message.client.commands.map(cmd => `\`${cmd.name}\`: ${cmd.description}`).join('\n');
        message.channel.send(`Available commands:\n${commands}`);
    }
};
