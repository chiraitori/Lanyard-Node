module.exports = {
    name: 'remind',
    description: 'Set a reminder',
    async execute(message, args) {
        const time = parseInt(args[0]);
        const unit = args[1];
        const reminder = args.slice(2).join(' ');

        if (isNaN(time) || !unit || !reminder) {
            return message.reply('Usage: !remind <time> <unit> <reminder>');
        }

        const ms = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        }[unit];

        if (!ms) {
            return message.reply('Invalid time unit. Use s, m, h, or d.');
        }

        setTimeout(() => {
            message.reply(`Reminder: ${reminder}`);
        }, time * ms);

        message.reply(`I will remind you in ${time} ${unit}(s).`);
    }
};
