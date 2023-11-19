const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'owner_list',
    description: "Affiche la liste des owners bot",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        if(!client.config.buyers.includes(interaction.user.id) && ! client.creators.includes(interaction.user.id))
            return interaction.followUp({content: "Cette commande est réservé aux buyers."}).catch(e=>{})
        let {owners} = await client.functions.getOwners(client, interaction.guildId)
        const embed = new Discord.MessageEmbed()
        if (owners.length < 1) {
            embed.setDescription("La owner list est vide")
            embed.setColor(client.config.color)
            return interaction.followUp({ embeds: [embed] }).catch(e => { })
        }
        else {
            let setup = []
            let isDone = false
            owners.map(async (id, n) => {
                let data = await client.functions.getUser(client, id)
                setup.push({ name: data.username + "#" + data.discriminator, id: id })
                while (!isDone) {
                    if (setup.length !== owners.length) return
                    else isDone = true
                    embed.setDescription(setup.map(v => `[${v.name}](https://discord.com/users/${v.id})`).join('\n'))
                    embed.setColor(client.config.color)
                    return interaction.followUp({ embeds: [embed] }).catch(e => { })
                }
            })
        }
    }
}