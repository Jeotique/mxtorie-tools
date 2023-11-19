const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leaderboard_invite',
    description: "Affiche le classement du serveur en terme d'invitations",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        let rowData = client.db.all().filter(v => v.key.startsWith(`invitesStats_${interaction.guildId}`))
        let allTest = []
        rowData.map(v => allTest.push({ userid: v.data.userid, invites: v.data.allvalid }))
        let currentData = allTest.sort((a, b) => b.invites - a.invites);
        currentData.length = 15
        let embed = new Discord.MessageEmbed()
            .setTitle(`${interaction.guild.name} - Invitations 🏆 !`)
            .setColor(client.config.color)
            .setDescription(currentData.map((data, i) => `**${++i}. <@${data.userid}>** - ${data.invites.toLocaleString()} ${data.invites < 2 ? 'invitation' : 'invitations'}`).join("\n"))
            .setFooter(client.config.footer)
            .setTimestamp()
        interaction.followUp({ embeds: [embed] }).catch(e=>{})
    }
}