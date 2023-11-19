const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'level_message',
    description: "Assigne un message de levelup.",
    type: "CHAT_INPUT",
    options: [{
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
        let messageText = interaction.options.getString("message")
        client.db.set(`levelupmessage_${interaction.guildId}`, messageText);
        return interaction.followUp({content: "Le message a bien été changé."}).catch(e=>{})
    }
}