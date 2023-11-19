const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'bot_leave',
    description: "Fait quitter le bot d'un serveur",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        description: "Quel est l'id du serveur à quitter ?",
        type: 'STRING',
        required: false
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
        let guild = interaction.options.getString("id")
        if (!guild && !interaction.guildId) return interaction.followUp({content:'Serveur introuvable.'}).catch(e=>{})
        if (!guild) guild = interaction.guildId
        if (!client.guilds.cache.has(guild)) return interaction.followUp({content:'Serveur introuvable.'}).catch(e=>{})
        const myguild = client.guilds.cache.get(guild)
        interaction.followUp({content:"Je quitte **" + myguild.name + "**"}).catch(e=>{})
        client.config.buyers.map(i => {
            if (!i) return
            if (!client.users.cache.has(i)) return
            client.users.cache.get(i)?.send(`Je viens de quitté **${myguild.name}** sous l'ordre de ${interaction.user}(${interaction.user.tag} / ${interaction.user.id}).`)
        })
        myguild.leave().catch(e => {
            client.config.buyers.map(i => {
                if (!i) return
                if (!client.users.cache.has(i)) return
                client.users.cache.get(i).send(`Une erreur est survenue lorsque j'ai voulu quitté **${myguild.name}** : \`${e}\``)
            })
        })
    }
}