const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leaderboard_message',
    description: "Affiche le classement du serveur en terme de message",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        let allMessageData = client.db.all().filter(a => a.key.startsWith(`stats_message_${interaction.guildId}_`) && a.key.includes("_channels_")) || []
        let messageData = []
        if(allMessageData.length < 1) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`${interaction.guild.name} - Messages 🏆 !`)
                .setColor(client.config.color)
                .setDescription("Aucune donnée à afficher...")
                .setFooter(client.config.footer)
                .setTimestamp()
            interaction.followUp({embeds: [embed]}).catch(e => {})
        } else {
            allMessageData.map(data => {
                if (!messageData.find(d => d.Id === data.key.split('_')[3])) {
                    let channels = {}
                    channels[data.key.split('_')[5]] = data.data
                    messageData.push({Id: data.key.split('_')[3], channels})
                } else {
                    messageData.find(d => d.Id === data.key.split('_')[3]).channels[data.key.split('_')[5]] = data.data
                }
            })
            let messageList = messageData.map(md => {
                let total = 0
                Object.keys(md.channels).map(k => total += md.channels[k])
                return {Id: md.Id, Total: total}
            }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message(s)\``).join("\n");
            let embed = new Discord.MessageEmbed()
                .setTitle(`${interaction.guild.name} - Messages 🏆 !`)
                .setColor(client.config.color)
                .setDescription(messageList)
                .setFooter(client.config.footer)
                .setTimestamp()
            interaction.followUp({embeds: [embed]}).catch(e => {})
        }
    }
}