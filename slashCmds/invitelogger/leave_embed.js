const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leave_embed',
    description: "Assigne un embed au message d'au revoir, pour cela le bot se base sur un embed déjà existant.",
    type: "CHAT_INPUT",
    options: [{
        name: 'type',
        description: 'A quel action servira cette embed ?',
        type: 'STRING',
        required: true,
        choices: [{
            name: 'Invité connu',
            description: 'Lorsque le membre qui a invité est connu',
            value: 'know_invite'
        }, {
            name: 'Invité par url perso',
            description: 'Lorsque le membre a rejoint avec l\'url personnalisée',
            value: 'vanity'
        }, {
            name: 'Invité inconnu',
            description: 'Lorsque le membre qui a invité est inconnu',
            value: 'unknow'
        }, {
            name: 'Invité sois même',
            description: 'Le membre a rejoint avec son propre lien',
            value: 'himself'
        }]
    },
        {
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
        let type = interaction.options.getString("type")
        let messageId = interaction.options.getString("message")
        const msg = await interaction.channel.messages.fetch(messageId).catch(e=>{})
        if(!msg) return interaction.followUp({content: "Ce message est introuvable."}).catch(e=>{})
        if(msg.embeds.length < 1) return interaction.followUp({content: "Ce message n'est pas un embed."}).catch(e=>{})
        for(emb of msg.embeds){
            if(emb.type !== 'rich') return interaction.followUp({content: "Ce message ne contient aucun embed que je puisse copier."}).catch(e=>{})
            switch(type){
                case 'know_invite': client.db.set(`leaveembed_${interaction.guildId}`, emb); break;
                case 'vanity': client.db.set(`leaveembedvanity_${interaction.guildId}`, emb); break;
                case 'unknow': client.db.set(`leaveembedunknow_${interaction.guildId}`, emb); break;
                case 'himself': client.db.set(`leaveembedhimself_${interaction.guildId}`, emb); break;
            }
            return interaction.followUp({content: "Le message a bien été copié."}).catch(e=>{})
        }
    }
}