const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'bot_activity',
    description: "Change l'activité du bot",
    type: "CHAT_INPUT",
    options: [{
        name: 'activité',
        description: "Quel sera la nouvelle activité ?",
        type: 'STRING',
        required: true,
        choices: [{
            name: "Streaming",
            value: "STREAMING"
        }, {
            name: "Listening",
            value: "LISTENING"
        }, {
            name: "Watching",
            value: "WATCHING"
        }, {
            name: "Competing",
            value: "COMPETING"
        }]
    }, {
        name: "message",
        description: "Quel sera le texte de l'activité ?",
        type: "STRING",
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
        let author = await client.db.get(`activity_${interaction.guildId}`)
        let timeout = 60000;
        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = client.ms(timeout - (Date.now() - author));
            let timeEmbed = new Discord.MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`❌ Tu as déjà changé l'activité du bot.\n\nRé-essayer dans : ${client.pretty(client.ms(time))} `);
            interaction.followUp({ embeds: [timeEmbed] })
        } else {
           let type2 = interaction.options.getString("activité")
            let msg = interaction.options.getString("message")
            if (type2 !== "STREAMING") client.user.setActivity(msg, { type: type2 })
            else client.user.setActivity(msg, { type: type2, url: "https://www.twitch.tv/Jeotique" })
            interaction.followUp(`\`${getNow().time}\` :white_check_mark: Activité changé pour : **${msg}** | Type : **${type2}**`)
            let data = {
                type: type2,
                msg: msg
            }
            client.db.set(`activity_${interaction.guildId}`, Date.now())
            return client.db.set(`data_activity`, data)
        }
    }
}