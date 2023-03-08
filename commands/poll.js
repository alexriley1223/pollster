const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Make a poll.')
        .addIntegerOption(option => option.setName('time').setDescription('Time in Minutes').setRequired(true))
        .addStringOption(option => option.setName('question').setDescription('Question to Poll').setRequired(true))
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
        var emojiOptions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
        var validOptions = [];
        var pollString = '';
        const expiryTime = interaction.options.getInteger('time') * 60000;

        for (let i = 1; i <= 8; i++) {
            if(interaction.options.getString('option' + i)) {
                options.push({
                    emoji: emojiOptions[counter],
                    value: interaction.options.getString('option' + i)
                });

                validOptions.push(emojiOptions[counter]);

                pollString += `${emojiOptions[counter]} ${interaction.options.getString('option' + i)} \n`
                counter++;
            }
        }

        const pollEmbed = new EmbedBuilder()
            .setColor(0xf39092)
            .setTitle(`📊 ${interaction.options.getString('question')}`)
            .setDescription(pollString)
            .setFooter({ text: "DEX Pollster", iconURL: "https://cdn.discordapp.com/avatars/1080256176501039269/7fde9905b0f87c3b7a90e07ef2a7bf32.png" })
            .setTimestamp()

        await interaction.reply({ embeds: [ pollEmbed ], fetchReply: true }).then((sentMessage) => {
            options.forEach(option => {
                sentMessage.react(`${option.emoji}`)
            });

            const filter = (reaction, user) => {
                /*
                if(reaction.emoji.name == "✅") {
                    reaction.users.remove(user);
                }
                */

                return validOptions.includes(reaction.emoji.name);
                // return reaction.emoji.name === "✅" && user.id === interaction.user.id;
            }

            const collector = sentMessage.createReactionCollector({ filter, time: expiryTime });

            collector.on("collect", async (reaction, user) => {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            });

            collector.on('end', collected => {
                let reduced = {};
                let total = 0;

                collected.forEach((val, index) => {
                    reduced[index] = val.count - 1;
                    total += (val.count - 1);
                });

                let max = Object.keys(reduced).reduce((a, v) => Math.max(a, reduced[v]), -Infinity);
                const result = Object.keys(reduced).filter(v => reduced[v] === max);
                const totalCount = max * result.length;
                const percentHolding = Math.floor((totalCount / total) * 100);
                let descArr = [];

                result.forEach(elem => {
                    var optionString = options.find(obj => {
                        return obj.emoji == elem;
                    });
                    descArr.push(optionString.value);
                });

                const endEmbed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle(`📊 ${interaction.options.getString('question')}`)
                    .setDescription(`${descArr.join(', ')} won with ${percentHolding}%!`)
                    .setFooter({ text: "DEX Polls" })
                    .setTimestamp()

                interaction.editReply({ embeds: [ endEmbed ]});
            });
        });
	},
};