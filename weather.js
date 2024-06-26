module.exports = {
    name: 'weather',
    description: 'Fetch and display the current weather for a specified location',
    async execute(message, args) {
        const apiKey = process.env.WEATHER_API_KEY;
        const location = args.join(' ');

        if (!location) {
            return message.reply('Please provide a location.');
        }

        const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                return message.reply('Location not found.');
            }

            const embed = {
                color: 0x1e90ff,
                title: `Weather in ${data.name}`,
                fields: [
                    { name: 'Temperature', value: `${data.main.temp} °C`, inline: true },
                    { name: 'Humidity', value: `${data.main.humidity} %`, inline: true },
                    { name: 'Wind Speed', value: `${data.wind.speed} m/s`, inline: true },
                    { name: 'Weather', value: data.weather[0].description, inline: true },
                ],
                timestamp: new Date(),
            };

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error fetching the weather data.');
        }
    }
};
