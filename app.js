const { Client, Collection, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } = require("discord.js");
const { Routes } = require('discord-api-types/v9');
const { token, clientID, guildID } = require('./config.json');
const { REST } = require('@discordjs/rest');
const fs = require('fs');


// Initiate Client
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions ] });

/* Register Poll Command */
const rest = new REST({ version: '9' }).setToken(token);
var poll = require(`./poll.js`);
var pollRegister = poll.data.toJSON();

(async () => {
	try {
    console.log('Started registering poll command.');

		await rest.put(
			Routes.applicationGuildCommands(clientID, guildID),
			{ body: [ pollRegister ] },
		);

		console.log('Successfully registered application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.commands = new Collection();
client.commands.set(poll.data.name, poll);

/* Cycle enabled events and execute on event call */
var eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);