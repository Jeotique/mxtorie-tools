const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leave_use_embed',
    description: "Définie si tel action doit utiliser sa fonction d'embed ou non.",
    type: "CHAT_INPUT",
    options: [{
        name: 'type',
        description: 'Dans quel action faut-il modifier le statut de l\'embed ?',
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
            name: 'embed',
            description: "Cette action doit-elle utiliser un embed ou non ?",
            type: 'BOOLEAN',
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
        let isEmbed = interaction.options.getBoolean("embed")
        switch(type){
            case 'know_invite': client.db.set(`leave_isembed_${interaction.guildId}`, isEmbed); break;
            case 'vanity': client.db.set(`leavevanity_isembed_${interaction.guildId}`, isEmbed); break;
            case 'unknow': client.db.set(`leaveunknow_isembed_${interaction.guildId}`, isEmbed); break;
            case 'himself': client.db.set(`leavehimself_isembed_${interaction.guildId}`, isEmbed); break;
        }
        return interaction.followUp({content: `Le type a bien été changé.\n${isEmbed ? "Embed activé.":"Embed désactivé."}`}).catch(e=>{})
    }
}