module.exports = {
    name: 'userinfo',
    description: 'Display information about a user',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const embed = {
            color: 0x0099ff,
            title: user.tag,
            thumbnail: { url: user.avatarURL() },
            fields: [
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Nickname', value: member.nickname || 'None', inline: true },
                { name: 'Joined Server On', value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true },
                { name: 'Account Created On', value: new Date(user.createdTimestamp).toLocaleDateString(), inline: true },
                { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true },
            ],
            timestamp: new Date(),
        };

        message.channel.send({ embeds: [embed] });
    }
};
