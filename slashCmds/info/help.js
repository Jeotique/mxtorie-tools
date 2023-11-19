const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'help',
    description: "Affiche la liste des commandes du bot",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        const embed = new Discord.MessageEmbed()
        embed.setTitle("**__Mxtorie__**")
        let cmds = client.slashCommands.all()
        embed.addField("**💎・Publique**", cmds.filter(v => v.data.category === "info").map(cmd => `**\`/${cmd.data.name}\`**`).join('\n'))
        embed.addField("**💌・InviteLogger**", cmds.filter(v => v.data.category === "invitelogger").map(cmd => `**\`/${cmd.data.name}\`**`).join('\n'))
        embed.addField("**⭐・Niveau**", cmds.filter(v => v.data.category === "level").map(cmd => `**\`/${cmd.data.name}\`**`).join('\n'))
        embed.addField("**🎭・Compteur**", cmds.filter(v => v.data.category === "counters").map(cmd => `**\`/${cmd.data.name}\`**`).join('\n'))
        embed.addField("**👑・Buyers**", cmds.filter(v => v.data.category === "buyer").map(cmd => `**\`/${cmd.data.name}\`**`).join('\n'))
        embed.addField("**🤖・Gestion**", cmds.filter(v => v.data.category === "bot").map(cmd => `**\`/${cmd.data.name}\`**`).join('\n'))
        embed.setColor(client.config.color)
        embed.setFooter(client.config.footer)
        return interaction.followUp({ embeds: [embed] }).catch(e=>{})
    }
}