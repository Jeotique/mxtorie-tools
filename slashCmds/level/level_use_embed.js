const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'level_use_embed',
    description: "Définie si le message de level doit être sous forme d'embed ou non.",
    type: "CHAT_INPUT",
    options: [{
            name: 'embed',
            description: "La fonction de level doit-elle utiliser un embed ou non ?",
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
        let isEmbed = interaction.options.getBoolean("embed")
        client.db.set(`levelup_isembed_${interaction.guildId}`, isEmbed);
        return interaction.followUp({content: `Le type a bien été changé.\n${isEmbed ? "Embed activé.":"Embed désactivé."}`}).catch(e=>{})
    }
}