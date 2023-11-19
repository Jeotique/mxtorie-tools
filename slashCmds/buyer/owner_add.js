const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'owner_add',
    description: "Ajoute un utilisateur à la liste des owners bot",
    type: "CHAT_INPUT",
    options: [{
        name: "membre",
        description: "Qui est la personne à ajouter dans la lsite des owners bot ?",
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
        let {al_owner} = await client.functions.addOwner(client, mention.id, interaction.guildId)
        if (al_owner) return interaction.followUp(`**${mention.user.tag}** est déjà owners.`).catch(e => { })
        else return interaction.followUp(`**${mention.user.tag}** est maintenant owner bot.`).catch(e => { })
    }
}