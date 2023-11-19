const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'counter_create',
    description: "Crée un salon compteur pour afficher les stats du serveur",
    type: "CHAT_INPUT",
    options: [{
        name: 'salon',
        description: "Quel salon voulez-vous utiliser ?",
        type: 'CHANNEL',
        required: true
    }, {
        name: 'texte',
        description: "Quel sera le texte de ce compteur ?",
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
        let askedChannel = interaction.options.getChannel("salon")
            if(askedChannel.type !== "GUILD_VOICE")
                return interaction.followUp({content: "Le salon n'est pas un salon vocal."}).catch(e=>{})
        let allCounters = client.db.get(`counters_${interaction.guildId}`) || []
        if(allCounters.find(c => c.channelId === askedChannel.id))
            return interaction.followUp({content: "Ce salon est déjà utilisé par un autre compteur."}).catch(e=>{})
        let channelText = interaction.options.getString("texte")
        let textToSet = channelText
        const vanity = await interaction.guild.fetchVanityData().catch(e=>{})
        Object.keys(client.variablesReplace.counter).map(key => {
            if (textToSet.includes(key)) textToSet = textToSet.replaceAll(key, client.variablesReplace.counter[key](interaction.guild, client.db, vanity))
        })
        interaction.guild.roles.cache.map(role => {
            if (textToSet.includes(`[${role.id}]`)) textToSet = textToSet.replaceAll(`[${role.id}]`, `${interaction.guild.members.cache.filter(m => m.roles.cache.has(role.id)).size}`)
        })
        askedChannel.setName(textToSet).then(async chan => {
            client.db.push(`counters_${interaction.guildId}`, {
                channelId: askedChannel.id,
                text: channelText
            })
            return interaction.followUp({content: "Le compteur a bien été créé avec succès."}).catch(e=>{})
        }).catch(e=>{
            return interaction.followUp({content: "Une erreur est survenue je n'ai pas pu modifier le nom du salon."}).catch(e=>{})
        })
    }
}