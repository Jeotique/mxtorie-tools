const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'welcome_channel',
    description: "Assigne le salon dans lequel le message de bienvenue sera envoyé",
    type: "CHAT_INPUT",
    options: [{
        name: 'salon',
        description: "Quel salon voulez-vous utiliser ?",
        type: 'CHANNEL',
        required: 'false'
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
        if(!askedChannel){
            if(!client.db.has(`welcomechannel_${interaction.guildId}`))
                return interaction.followUp({content: "Aucun salon de bievenue n'est configuré."}).catch(e=>{})
            client.db.delete(`welcomechannel_${interaction.guildId}`)
            return interaction.followUp({content: "Le salon de bienvenue a bien été désactivé."}).catch(e=>{})
        } else {
            if(askedChannel.id === client.db.get(`welcomechannel_${interaction.guildId}`))
                return interaction.followUp({content: `${askedChannel} est déjà configuré en tant que salon de bienvenue.`}).catch(e=>{})
            if(askedChannel.type !== "GUILD_TEXT")
                return interaction.followUp({content: "Le salon n'est pas un salon textuel."}).catch(e=>{})
            client.db.set(`welcomechannel_${interaction.guildId}`, askedChannel.id)
            return interaction.followUp({content: `${askedChannel} sera maintenant le salon de bienvenue.`}).catch(e=>{})
        }
    }
}