const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const promClient = require('prom-client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Environment variables for configuration
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'lanyard';
const botToken = process.env.BOT_TOKEN;
const port = process.env.HTTP_PORT || 3000;

// Initialize Express server
const app = express();
app.use(express.json());

// Initialize MongoDB client
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize Discord bot
const discordBot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences] });
discordBot.commands = new Collection();

// Load command files
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    discordBot.commands.set(command.name, command);
}

// Setup metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const cachedPresences = db.collection('cached_presences');
        const globalSubscribers = db.collection('global_subscribers');
        const analytics = db.collection('analytics');
        const presenceNotifications = db.collection('presence_notifications');

        // CRUD routes for cached_presences
        app.get('/cached_presences', async (req, res) => {
            const data = await cachedPresences.find().toArray();
            res.json(data);
        });

        app.post('/cached_presences', async (req, res) => {
            const result = await cachedPresences.insertOne(req.body);
            res.json(result);
        });

        app.put('/cached_presences/:id', async (req, res) => {
            const { id } = req.params;
            const result = await cachedPresences.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
            res.json(result);
        });

        app.delete('/cached_presences/:id', async (req, res) => {
            const { id } = req.params;
            const result = await cachedPresences.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        });

        // CRUD routes for global_subscribers
        app.get('/global_subscribers', async (req, res) => {
            const data = await globalSubscribers.find().toArray();
            res.json(data);
        });

        app.post('/global_subscribers', async (req, res) => {
            const result = await globalSubscribers.insertOne(req.body);
            res.json(result);
        });

        app.put('/global_subscribers/:id', async (req, res) => {
            const { id } = req.params;
            const result = await globalSubscribers.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
            res.json(result);
        });

        app.delete('/global_subscribers/:id', async (req, res) => {
            const { id } = req.params;
            const result = await globalSubscribers.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        });

        // CRUD routes for analytics
        app.get('/analytics', async (req, res) => {
            const data = await analytics.find().toArray();
            res.json(data);
        });

        app.post('/analytics', async (req, res) => {
            const result = await analytics.insertOne(req.body);
            res.json(result);
        });

        app.put('/analytics/:id', async (req, res) => {
            const { id } = req.params;
            const result = await analytics.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
            res.json(result);
        });

        app.delete('/analytics/:id', async (req, res) => {
            const { id } = req.params;
            const result = await analytics.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        });

        // Route to get presence data for a specific user
        app.get('/presence/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const presenceData = await cachedPresences.findOne({ userId: id });

                if (!presenceData) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                res.json({ success: true, data: presenceData });
            } catch (error) {
                console.error(`Error fetching presence data: ${error}`);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        });

        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        // Discord bot event handlers
        discordBot.once('ready', () => {
            console.log(`Logged in as ${discordBot.user.tag}!`);
        });

        discordBot.on('messageCreate', async (message) => {
            if (!message.content.startsWith('!') || message.author.bot) return;

            const args = message.content.slice(1).split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = discordBot.commands.get(commandName);

            if (!command) return;

            try {
                await command.executePrefix(message, args);
            } catch (error) {
                console.error(`Error executing command: ${error}`);
                message.reply('There was an error executing that command!');
            }
        });

        discordBot.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isCommand()) return;

            const command = discordBot.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing slash command: ${error}`);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });

        discordBot.on('presenceUpdate', async (oldPresence, newPresence) => {
            try {
                if (!newPresence) return;

                const { userId, status } = newPresence;
                const activities = newPresence.activities.map(activity => ({
                    id: activity.id,
                    name: activity.name,
                    type: activity.type,
                    state: activity.state,
                    details: activity.details,
                    timestamps: activity.timestamps,
                    assets: activity.assets,
                    party: activity.party,
                    createdAt: activity.createdTimestamp,
                }));

                const presenceData = {
                    userId: userId,
                    username: newPresence.user.username,
                    avatar: newPresence.user.avatar,
                    discriminator: newPresence.user.discriminator,
                    globalName: newPresence.user.globalName,
                    displayName: newPresence.user.displayName,
                    publicFlags: newPresence.user.publicFlags,
                    activities: activities,
                    status: status,
                    activeOnDiscordWeb: newPresence.clientStatus?.web || false,
                    activeOnDiscordDesktop: newPresence.clientStatus?.desktop || false,
                    activeOnDiscordMobile: newPresence.clientStatus?.mobile || false,
                    listeningToSpotify: activities.some(activity => activity.name === 'Spotify'),
                };

                await cachedPresences.updateOne(
                    { userId: userId },
                    { $set: presenceData },
                    { upsert: true }
                );

            } catch (error) {
                console.error(`Error handling presence update: ${error}`);
            }
        });

        // Improved error handling for Discord bot
        process.on('unhandledRejection', error => {
            console.error('Unhandled promise rejection:', error);
        });

        // Log in to Discord
        await discordBot.login(botToken);

    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();
