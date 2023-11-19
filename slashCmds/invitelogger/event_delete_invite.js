const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'event_delete_invite',
    description: "Supprime un event d'invitations",
    type: "CHAT_INPUT",
    options: [{
        name: 'nom',
        description: "Quel est le nom de l'event à supprimer ?",
        type: 'STRING',
        required: true,
    }],
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
        let eventName = interaction.options.getString("nom")
        let allEvents = client.db.get(`invite_events_${interaction.guildId}`) || []
        if(!allEvents.find(event => event.name === eventName))
            return interaction.followUp({content: "Cette event n'existe pas."}).catch(e=>{})
        allEvents = allEvents.filter(event => event.name !== eventName)
        client.db.set(`invite_events_${interaction.guildId}`, allEvents)
        return interaction.followUp({content: `L'event \`${eventName}\` a bien été supprimé.`}).catch(e=>{})
    }
}