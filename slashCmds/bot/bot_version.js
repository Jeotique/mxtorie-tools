const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'bot_version',
    description: "Annonce si le bot est à jour ou non",
    type: "CHAT_INPUT",
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

        client.axios.get(`https://apolobite.000webhostapp.com/important5/version.txt`).then(async (result) => {
            if (result.data === client.version) return interaction.followUp("Votre bot est à jour.").catch(e => { })
            else return interaction.followUp(`Votre bot n'est pas à jour, \`/update\``).catch(e => { })
        }).catch(e => {
            return interaction.followUp("Une erreur est survenue, contacter mon créateur.").catch(e => { })
        })
    }
}