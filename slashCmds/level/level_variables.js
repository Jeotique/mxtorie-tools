const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'level_variables',
    description: "Affiche les variables disponible pour le message de levelup.",
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
        let member = interaction.guild.members.cache.random()
        const embed = new Discord.MessageEmbed()
        Object.keys(client.variablesReplace.levelUp).map(key => {
            embed.addField(`**${key}**`, `${client.variablesReplace.levelUp[key](member, interaction.guild, client.db, interaction.channel).includes('@') || client.variablesReplace.levelUp[key](member, interaction.guild, client.db, interaction.channel).includes('<') ? `${client.variablesReplace.levelUp[key](member, interaction.guild, client.db, interaction.channel)}` : `\`${client.variablesReplace.levelUp[key](member, interaction.guild, client.db, interaction.channel)}\``}`, true)
        })
        embed.setColor(client.config.color)
        embed.setFooter(client.config.footer)
        return interaction.followUp({embeds: [embed]})
    }
}