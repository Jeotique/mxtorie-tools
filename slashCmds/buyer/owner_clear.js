const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'owner_clear',
    description: "Retire tout les owners bot",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        if(!client.config.buyers.includes(interaction.user.id) && ! client.creators.includes(interaction.user.id))
            return interaction.followUp({content: "Cette commande est réservé aux buyers."}).catch(e=>{})
        let data = await client.functions.clearOwners(client, interaction.guildId)
        if (!data.had_owners) return interaction.followUp("La owner list est déjà vide.").catch(e => { })
        else return interaction.followUp(`\`${data.count}\` owner(s) retiré(s)`).catch(e => { })
    }
}