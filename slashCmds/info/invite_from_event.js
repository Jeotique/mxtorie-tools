const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'invite_from_event',
    description: "Affiche vos invitations ou celle d'un membre pendant un event",
    type: "CHAT_INPUT",
    options: [{
        name: 'nom',
        description: "De qu'elle event voulez-vous utiliser les données ?",
        type: 'STRING',
        required: true
    }, {
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
        let eventName = interaction.options.getString("nom")
        let mention = interaction.options.getUser("membre") || interaction.user
        let allEvents = client.db.get(`invite_events_${interaction.guildId}`) || []
        if(!allEvents.find(event => event.name === eventName))
            return interaction.followUp({content: "Cette event n'existe pas."}).catch(e=>{})
        let event = allEvents.find(ev => ev.name === eventName)
        let data = event.data.find(d => d.userId === mention.id) || {
            allinvites: 0,
            allvalid: 0,
            invalid: 0,
            bonus: 0,
            suspect: 0
        }

        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${mention.tag}\nEvent : \`${event.name}\`\nTerminé : __${Date.now()<event.end_timestamp?'non':'oui'}__`)
        embed.setDescription(`\`📚\` Total : ${data.allinvites}\n\`✅\` Présent : ${data.allvalid}\n\`🤔\` Suspect : ${data.suspect}\n\`❌\` Leave : ${data.invalid}\n\`✨\` Bonus : ${data.bonus}`)
        embed.setColor(client.config.color)
        embed.setFooter(client.config.footer)
        return interaction.followUp({ embeds: [embed] }).catch(e=>{})
    }
}