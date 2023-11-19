const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'event_list_invite',
    description: "Affiche la liste des events d'invitations",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        let {owners} = await client.functions.getOwners(client, interaction.guildId)
        if(!owners.includes(interaction.user.id) && !client.config.buyers.includes(interaction.user.id) && !client.creators.includes(interaction.user.id) && !interaction.memberPermissions.has("MANAGE_GUILD"))
            return interaction.followUp({content: "Vous n'avez pas les permissions nécessaire."}).catch(e=>{})
        let allEvents = client.db.get(`invite_events_${interaction.guildId}`) || []
        if(allEvents.length < 1)
            return interaction.followUp({content: "Il n'existe aucun event d'invitations."}).catch(e=>{})
        let embed = new Discord.MessageEmbed()
        embed.setTitle("Invites event(s)")
        embed.setColor(client.config.color)
        embed.setFooter(client.config.footer)
        allEvents.map(event => {
            embed.addField(`**${event.name}**`, `Créé par : <@${event.createdBy}>\nTerminé <t:${event.end_timestamp.toString().slice(0, -3)}:R>`, true)
        })
        interaction.followUp({embeds: [embed]}).catch(e=>{})
    }
}