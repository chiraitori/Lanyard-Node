const { isOwner } = require('../utils/checkOwner');

module.exports = {
    name: 'roleinfo',
    description: 'Display information about a specific role',
    async execute(message, args) {
        if (!isOwner(message.author.id)) {
            return message.reply('You do not have permissions to use this command.');
        }

        const roleName = args.join(' ');
        const role = message.guild.roles.cache.find(role => role.name === roleName);

        if (!role) {
            return message.reply('Role not found.');
        }

        const embed = {
            color: role.color,
            title: role.name,
            fields: [
                { name: 'Role ID', value: role.id, inline: true },
                { name: 'Members', value: `${role.members.size}`, inline: true },
                { name: 'Color', value: role.hexColor, inline: true },
                { name: 'Position', value: `${role.position}`, inline: true },
                { name: 'Created On', value: new Date(role.createdTimestamp).toLocaleDateString(), inline: true },
                { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
            ],
            timestamp: new Date(),
        };

        message.channel.send({ embeds: [embed] });
    }
};
