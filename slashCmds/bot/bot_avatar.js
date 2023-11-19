const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'bot_avatar',
    description: "Change l'avatar du bot",
    type: "CHAT_INPUT",
    options: [{
        name: 'url',
        description: "Quel est l'url de l'image à assigner ? Sinon passer à l'argument suivant.",
        type: 'STRING',
        required: false
    }, {
        name: "image",
        description: "Quel est l'image à assigner ?",
        type: "ATTACHMENT",
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
        let author = await client.db.get(`avatar_${interaction.guildId}`)
        let timeout = 600000;
        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = client.ms(timeout - (Date.now() - author));
            let timeEmbed = new Discord.MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`❌ Tu as déjà changé la photo de profil.\n\nRé-essayer dans : ${client.pretty(client.ms(time))} `);
            interaction.followUp({ embeds: [timeEmbed] })
        } else {
            if (!interaction.guild) return
            let attachment = interaction.options.getAttachment("image")
            if (attachment) {
                client.user.setAvatar(attachment.url).then(u => {
                    interaction.followUp(`\`${getNow().time}\` :white_check_mark: ${interaction.user}, Avatar changé avec succès.`)
                    client.db.set(`avatar_${interaction.guildId}`, Date.now())
                }).catch(e => {
                    return interaction.followUp(`\`${getNow().time}\` :x: ${interaction.user}, Une erreur a été rencontré. \n **Plus d\'informations :** \`🔻\` \`\`\`${e}\`\`\``)
                });
            }else {
                let str_content = interaction.options.getString("url")
                if (!str_content) return interaction.followUp({content: "Argument manquant."}).catch(e => {
                })
                client.user.setAvatar(str_content)
                    .then(u => {
                        interaction.followUp(`\`${getNow().time}\` :white_check_mark: ${interaction.user}, Avatar changé avec succès.`)
                        client.db.set(`avatar_${interaction.guildId}`, Date.now())
                    })
                    .catch(e => {
                        return interaction.followUp(`\`${getNow().time}\` :x: Une erreur a été rencontré. \n **Plus d\'informations :** \`🔻\` \`\`\`${e}\`\`\``)
                    });
            }
        }
    }
}