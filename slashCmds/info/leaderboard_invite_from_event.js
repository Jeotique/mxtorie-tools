const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leaderboard_invite_from_event',
    description: "Affiche le classement du serveur en terme d'invitations pendant un event",
    type: "CHAT_INPUT",
    options: [{
        name: 'nom',
        description: "De qu'elle event voulez-vous afficher le classement ?",
        type: 'STRING',
        required: true
    }],
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        let eventName = interaction.options.getString("nom")
        let allEvents = client.db.get(`invite_events_${interaction.guildId}`) || []
        if(!allEvents.find(event => event.name === eventName))
            return interaction.followUp({content: "Cette event n'existe pas."}).catch(e=>{})
        let event = allEvents.find(ev => ev.name === eventName)
        let allTest = []
        event.data.map(v => allTest.push({ userid: v.userId, invites: v.allvalid }))
        let currentData = allTest.sort((a, b) => b.invites - a.invites);
        currentData.length = 15
        let embed = new Discord.MessageEmbed()
            .setTitle(`${interaction.guild.name} - Invitations 🏆 !\nEvent : \`${event.name}\`\nTerminé : __${Date.now()<event.end_timestamp?'non':'oui'}__`)
            .setColor(client.config.color)
            .setDescription(event.data.length < 1 ? "Aucune invitation n'a été encore enregistée." : currentData.map((data, i) => `**${++i}. <@${data.userid}>** - ${data.invites.toLocaleString()} ${data.invites < 2 ? 'invitation' : 'invitations'}`).join("\n"))
            .setFooter(client.config.footer)
            .setTimestamp()
        interaction.followUp({ embeds: [embed] }).catch(e=>{})
    }
}