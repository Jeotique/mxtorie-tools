const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'counter_delete',
    description: "Supprime un compteur",
    type: "CHAT_INPUT",
    options: [{
        name: 'salon',
        description: "De quel salon voulez-vous supprimer le compteur ?",
        type: 'CHANNEL',
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
        let askedChannel = interaction.options.getChannel("salon")
        if(askedChannel.type !== "GUILD_VOICE")
            return interaction.followUp({content: "Le salon n'est pas un salon vocal."}).catch(e=>{})
        let allCounters = client.db.get(`counters_${interaction.guildId}`) || []
        if(!allCounters.find(c => c.channelId === askedChannel.id)) return interaction.followUp({content: "Ce salon n'est pas utilisé en tant que compteur."}).catch(e=>{})
        let all = client.db.get(`counters_${interaction.guildId}`) || []
        all = all.filter(c => c.channelId !== askedChannel.id)
        client.db.set(`counters_${interaction.guildId}`, all)
        return interaction.followUp({content: "Le compteur a bien été supprimé."}).catch(e=>{})
    }
}