const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'invite',
    description: "Affiche vos invitations ou celle d'un membre",
    type: "CHAT_INPUT",
    options: [{
        name: 'membre',
        description: "De qui voulez-vous voir les invitations ?",
        type: 'USER',
        required: false
    }],
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
       /* let {owners} = await client.functions.getOwners(client, interaction.guildId)
        if(!owners.includes(interaction.user.id) && !client.config.buyers.includes(interaction.user.id) && !client.creators.includes(interaction.user.id) && !interaction.memberPermissions.has("MANAGE_GUILD"))
            return interaction.followUp({content: "Vous n'avez pas les permissions nécessaire."}).catch(e=>{})*/
        let mention = interaction.options.getUser("membre") || interaction.user
        let data = client.db.get(`invitesStats_${interaction.guildId}_${mention.id}`) || {
            allinvites: 0,
            allvalid: 0,
            invalid: 0,
            bonus: 0,
            suspect: 0
        }

        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${mention.tag}`)
        embed.setDescription(`\`📚\` Total : ${data.allinvites}\n\`✅\` Présent : ${data.allvalid}\n\`🤔\` Suspect : ${data.suspect}\n\`❌\` Leave : ${data.invalid}\n\`✨\` Bonus : ${data.bonus}`)
        embed.setColor(client.config.color)
        embed.setFooter(client.config.footer)
        return interaction.followUp({ embeds: [embed] }).catch(e=>{})
    }
}