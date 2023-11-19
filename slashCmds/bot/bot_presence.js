const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'bot_presence',
    description: "Change la présence du bot",
    type: "CHAT_INPUT",
    options: [{
        name: 'presence',
        description: "Quel sera la nouvelle présence ?",
        type: 'STRING',
        required: true,
        choices: [{
            name: "En ligne",
            value: "online"
        }, {
            name: "Ne pas déranger",
            value: "dnd"
        }, {
            name: "Absent",
            value: "idle"
        }, {
            name: "Invisible",
            value: "invisible"
        }]
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
        let author = await client.db.get(`presence_${interaction.guildId}`)
        let timeout = 10000;
        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = client.ms(timeout - (Date.now() - author));
            let timeEmbed = new Discord.MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`❌ Tu as déjà changé la présence du bot.\n\nRé-essayer dans : ${client.pretty(client.ms(time))} `);
            interaction.followUp({ embeds: [timeEmbed] }).catch(e => {})
        } else {
            if (!interaction.guild) return
            let pre = interaction.options.getString("presence")
            client.user.setStatus(pre)
            interaction.followUp(`\`${getNow().time}\` :white_check_mark: ${interaction.user}, Statut changé pour : **${pre}**\n_Cela peut prendre un moment_`)
            client.db.set(`presence_${interaction.guildId}`, Date.now())
            return client.db.set("data_presence", pre)
        }
    }
}