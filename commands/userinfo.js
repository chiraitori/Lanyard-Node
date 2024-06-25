module.exports = {
    name: 'userinfo',
    description: 'Fetch and display information about a user',
    async execute(message, args) {
        let user;
        if (args.length) {
            try {
                user = await message.client.users.fetch(args[0]);
            } catch (error) {
                return message.reply('Unable to find the user.');
            }
        } else {
            user = message.author;
        }

        const member = message.guild.members.cache.get(user.id);
        const embed = {
            color: 0x0099ff,
            title: user.tag,
            thumbnail: { url: user.displayAvatarURL() },
            fields: [
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Nickname', value: member ? member.nickname || 'None' : 'N/A', inline: true },
                { name: 'Account Created', value: new Date(user.createdTimestamp).toLocaleDateString(), inline: true },
                { name: 'Joined Server', value: member ? new Date(member.joinedTimestamp).toLocaleDateString() : 'N/A', inline: true }
            ],
            timestamp: new Date(),
        };

        message.channel.send({ embeds: [embed] });
    }
};
