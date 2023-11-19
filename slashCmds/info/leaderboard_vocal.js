const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const moment = require('moment')
require('moment-duration-format')
module.exports = {
    name: 'leaderboard_vocal',
    description: "Affiche le classement du serveur en terme de vocal",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        let allVoiceData = client.db.all().filter(a => a.key.startsWith(`stats_voice_${interaction.guildId}_`) && a.key.includes("_channels_")) || []
        let voiceData = []
        if(allVoiceData.length < 1) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`${interaction.guild.name} - Vocal 🏆 !`)
                .setColor(client.config.color)
                .setDescription("Aucune donnée à afficher...")
                .setFooter(client.config.footer)
                .setTimestamp()
            interaction.followUp({embeds: [embed]}).catch(e => {})
        } else {
            allVoiceData.map(data => {
                if (!voiceData.find(d => d.Id === data.key.split('_')[3])) {
                    let channels = {}
                    channels[data.key.split('_')[5]] = data.data
                    voiceData.push({Id: data.key.split('_')[3], channels})
                } else {
                    voiceData.find(d => d.Id === data.key.split('_')[3]).channels[data.key.split('_')[5]] = data.data
                }
            })
            let voiceList = voiceData.map(md => {
                let total = 0
                Object.keys(md.channels).map(k => total += md.channels[k])
                return {Id: md.Id, Total: total}
            }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hours] m [minutes], s [seconds]").replaceAll('seconds', 'secondes').replaceAll('hours', 'heures')}\``).join("\n");
            let embed = new Discord.MessageEmbed()
                .setTitle(`${interaction.guild.name} - Vocal 🏆 !`)
                .setColor(client.config.color)
                .setDescription(voiceList)
                .setFooter(client.config.footer)
                .setTimestamp()
            interaction.followUp({embeds: [embed]}).catch(e => {})
        }
    }
}