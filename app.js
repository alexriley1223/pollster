const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Routes } = require('discord-api-types/v9');
const { token, clientID, guildID } = require('./config.json');
const { REST } = require('@discordjs/rest');
const fs = require('fs');
const path = require('path');

// Initiate Client
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions ] });

/* Register Poll Command */
const rest = new REST({ version: '9' }).setToken(token);

let registeredCommands = [];
client.commands = new Collection();

const getAllCommands = function(dirPath, arrayOfCommands) {
    let commandFiles = fs.readdirSync(dirPath);

    arrayOfCommands = arrayOfCommands || []

    commandFiles.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfCommands = getAllCommands(dirPath + "/" + file, arrayOfCommands);
        } else {
            arrayOfCommands.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfCommands;
}

// Recursively pull all commands from commandPath folder and subfolders
const commandFiles = getAllCommands('./commands');

/* Cycle enabled commands and add each command to collection */
for (const file of commandFiles) {
	const command = require(`./${file}`);
	client.commands.set(command.data.name, command);
	registeredCommands.push(command.data.toJSON());
}

(async () => {
	try {
    console.log('Started registering poll command.');

		await rest.put(
			Routes.applicationGuildCommands(clientID, guildID),
			{ body: registeredCommands },
		);

		console.log('Successfully registered application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

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