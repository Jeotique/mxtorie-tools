const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'level_embed',
    description: "Assigne un embed au message de levelup, pour cela le bot se base sur un embed déjà existant.",
    type: "CHAT_INPUT",
    options: [{
            name: 'message',
            description: "Quel est l'id du message à utiliser ?",
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
        let {owners} = await client.functions.getOwners(client, interaction.guildId)
        if(!owners.includes(interaction.user.id) && !client.config.buyers.includes(interaction.user.id) && !client.creators.includes(interaction.user.id) && !interaction.memberPermissions.has("MANAGE_GUILD"))
            return interaction.followUp({content: "Vous n'avez pas les permissions nécessaire."}).catch(e=>{})
        let messageId = interaction.options.getString("message")
        const msg = await interaction.channel.messages.fetch(messageId).catch(e=>{})
        if(!msg) return interaction.followUp({content: "Ce message est introuvable."}).catch(e=>{})
        if(msg.embeds.length < 1) return interaction.followUp({content: "Ce message n'est pas un embed."}).catch(e=>{})
        for(emb of msg.embeds){
            if(emb.type !== 'rich') return interaction.followUp({content: "Ce message ne contient aucun embed que je puisse copier."}).catch(e=>{})
            client.db.set(`levelupembed_${interaction.guildId}`, emb);
            return interaction.followUp({content: "Le message a bien été copié."}).catch(e=>{})
        }
    }
}