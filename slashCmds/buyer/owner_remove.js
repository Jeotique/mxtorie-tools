const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'owner_remove',
    description: "Retire un utilisateur de la liste des owners bot",
    type: "CHAT_INPUT",
    options: [{
        name: "membre",
        description: "Qui est la personne à retirer de la lsite des owners bot ?",
        type: "USER",
        required: true
    }],
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        if(!client.config.buyers.includes(interaction.user.id) && ! client.creators.includes(interaction.user.id))
            return interaction.followUp({content: "Cette commande est réservé aux buyers."}).catch(e=>{})
        let mention = interaction.options.getMember("membre")
        let { removed } = await client.functions.removeOwner(client, mention.id, interaction.guildId)
        if (!removed) return interaction.followUp(`**${mention.user.tag}** n'est pas owner bot.`).catch(e => { })
        else return interaction.followUp(`**${mention.user.tag}** n'est plus owner bot.`).catch(e => { })
    }
}