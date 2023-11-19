const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leave_message',
    description: "Assigne un message d'au revoir",
    type: "CHAT_INPUT",
    options: [{
        name: 'type',
        description: 'A quel action servira ce message ?',
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
            description: "Quel sera le message envoyé par le bot ?       \\n : saut à la ligne.",
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
        let messageText = interaction.options.getString("message")
        switch(type){
            case 'know_invite': client.db.set(`leavemessage_${interaction.guildId}`, messageText); break;
            case 'vanity': client.db.set(`leavemessagevanity_${interaction.guildId}`, messageText); break;
            case 'unknow': client.db.set(`leavemessageunknow_${interaction.guildId}`, messageText); break;
            case 'himself': client.db.set(`leavemessagehimself_${interaction.guildId}`, messageText); break;
        }
        return interaction.followUp({content: "Le message a bien été changé."}).catch(e=>{})
    }
}