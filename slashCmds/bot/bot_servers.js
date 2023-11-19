const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'bot_servers',
    description: "Affiche la liste des serveurs sur lequel ce trouve le bot",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        let {owners} = await client.functions.getOwners(client, interaction.guildId)
        if(!owners.includes(interaction.user.id) && !client.config.buyers.includes(interaction.user.id) && !client.creators.includes(interaction.user.id) && !interaction.memberPermissions.has("MANAGE_GUILD"))
        {
            await interaction.deferReply().catch(e=>{})
            return interaction.followUp({content: "Vous n'avez pas les permissions nécessaire."}).catch(e=>{})
        }
        let desc = ""
        let ind = 0
        interaction.reply("Recherche...").then(async msg => {
            client.guilds.cache.filter(g => g.id !== "855557733389959188").map(async g => {
                let invite = await g.channels.cache.filter(c => c.permissionsFor(client.user.id, true).has('CREATE_INSTANT_INVITE') && c.type === 'GUILD_TEXT').first()?.createInvite({ maxAge: 0, maxUses: 0 }).then(async inv => {
                    ++ind
                    if (inv) desc += `[${g.name}](${inv.url})\n`
                    else desc += `${g.name} : erreur d'invite\n`
                    if (ind === client.guilds.cache.filter(g => g.id !== "855557733389959188").size) {
                        let embed = new Discord.MessageEmbed()
                        embed.setTitle("Mes serveurs")
                        embed.setColor(client.config.color)
                        embed.setTimestamp()
                        embed.setDescription(desc)
                        return interaction.editReply({ content: null, embeds: [embed] }).catch(e=>{})
                    }
                }).catch(e => { ++ind })
            })
        })
    }
}