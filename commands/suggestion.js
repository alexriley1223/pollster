const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { suggestionChannelId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('suggestion')
		.setDescription('Make a server suggestion.')
        .addStringOption(option => 
            option.setName('suggestion')
                .setDescription("Suggestion for the server")
                .setMaxLength(500)
                .setRequired(true)),

    async execute(interaction) {
        const suggestion = interaction.options.getString('suggestion');
        const user = interaction.user.tag;

        const suggestionEmbed = new EmbedBuilder()
            .setColor(0xf39092)
            .setTitle(`Suggestion by ${user}`)
            .setDescription('```'+suggestion+'```')
            .setFooter({ text: 'DEX Pollster', iconURL: 'https://cdn.discordapp.com/avatars/1080256176501039269/7fde9905b0f87c3b7a90e07ef2a7bf32.png' })
            .setTimestamp()

        interaction.client.channels.cache.get(suggestionChannelId).send({ embeds: [ suggestionEmbed ]}).then((message) => {
            message.react('👍');
            message.react('👎');
        });

        await interaction.reply({ content: 'Your suggestion has been sent!', ephemeral: true }).catch((e) => console.log(e));
    }
}