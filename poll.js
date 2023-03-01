const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Make a poll.')
        .addStringOption(option => option.setName('option1').setDescription('Option One').setRequired(true))
        .addStringOption(option => option.setName('option2').setDescription('Option Two').setRequired(true))
        .addStringOption(option => option.setName('option3').setDescription('Option Three'))
        .addStringOption(option => option.setName('option4').setDescription('Option Four'))
        .addStringOption(option => option.setName('option5').setDescription('Option Five'))
        .addStringOption(option => option.setName('option6').setDescription('Option Six'))
        .addStringOption(option => option.setName('option7').setDescription('Option Seven'))
        .addStringOption(option => option.setName('option8').setDescription('Option Eight')),
	async execute(interaction) {

        var options = [];
        var counter = 0;
        var emojiOptions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']

        for (let i = 1; i <= 8; i++) {
            if(interaction.options.getString('option' + i)) {
                options.push({
                    emoji: emojiOptions[counter],
                    value: interaction.options.getString('option' + i)
                });
                counter++;
            }
        }
        
        console.log(options);

        const pollEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Test")
            .setDescription("Description")
            .setFooter({ text: "Text" })

        await interaction.reply({ embeds: [ pollEmbed ], fetchReply: true }).then((sentMessage) => {
            options.forEach(option => {
                sentMessage.react(`${option.emoji}`)
            });

            const filter = (reaction, user) => {
                if(reaction.emoji.name == "✅") {
                    reaction.users.remove(user);
                }

                return true;
                // return reaction.emoji.name === "✅" && user.id === interaction.user.id;
            }

            const collector = sentMessage.createReactionCollector({ filter, time: 30000 });

            collector.on("collect", async (reaction, user) => {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
            });
        });
	},
};