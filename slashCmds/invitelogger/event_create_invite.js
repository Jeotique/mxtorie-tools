const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'event_create_invite',
    description: "Crée des events d'invitations, pendant un certain temps un autre compteur sera activé",
    type: "CHAT_INPUT",
    options: [{
        name: 'nom',
        description: "Quel est le nom de l'event ?",
        type: 'STRING',
        required: true,
    }, {
        name: 'temps',
        description: "Combien de temps durera l'event ?",
        type: "STRING",
        required: true
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
        let askedTime = interaction.options.getString("temps")
        let allEvents = client.db.get(`invite_events_${interaction.guildId}`) || []
        if(allEvents.find(event => event.name === eventName))
            return interaction.followUp({content: "Un event de ce nom existe déjà."}).catch(e=>{})
        let time = client.ms(askedTime)
        if(time < 10000) return interaction.followUp({content: "Le temps ne peut pas être inférieur à 10 secondes."}).catch(e=>{})
        if(time > 1296000000) return interaction.followUp({content: "Le temps ne peut pas être plus grand que 15 jours."}).catch(e=>{})
        client.db.push(`invite_events_${interaction.guildId}`, {
            name: eventName,
            time,
            end_timestamp: Date.now()+time,
            createdBy: interaction.user.id,
            data: []
        })
        return interaction.followUp({content: `L'event \`${eventName}\` a commencé, celui-ci sera terminé <t:${(Date.now()+time).toString().slice(0, -3)}:R>.`}).catch(e=>{})
    }
}