const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'event_edit_invite',
    description: "Modifie le temps d'un event d'invitations",
    type: "CHAT_INPUT",
    options: [{
        name: 'nom',
        description: "Quel est le nom de l'event ?",
        type: 'STRING',
        required: true,
    }, {
        name: 'temps',
        description: "Quel sera le nouveau temps ?",
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
        if(!allEvents.find(event => event.name === eventName))
            return interaction.followUp({content: "Cette event n'existe pas."}).catch(e=>{})
        let time = client.ms(askedTime)
        if(time < 10000) return interaction.followUp({content: "Le temps ne peut pas être inférieur à 10 secondes."}).catch(e=>{})
        if(time > 1296000000) return interaction.followUp({content: "Le temps ne peut pas être plus grand que 15 jours."}).catch(e=>{})
        allEvents.find(event => event.name === eventName).time = time
        allEvents.find(event => event.name === eventName).end_timestamp = Date.now()+time
        client.db.set(`invite_events_${interaction.guildId}`, allEvents)
        return interaction.followUp({content: `L'event \`${eventName}\` a bien été modifié, celui-ci sera terminé <t:${(Date.now()+time).toString().slice(0, -3)}:R>.`}).catch(e=>{})
    }
}