const Discord = require('discord.js-mxtorie')
const { Mxtorie } = require('../../structures/client')
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'guildDelete',

    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Guild} guild
     */
    run: async (client, guild) => {
        if (!guild.available) return
        console.log(`Je viens de quitté :`)
        console.log(guild.name)
        console.log(`Membres : ${guild.memberCount}`)
        let owner = await guild.fetchOwner()
        console.log(`Proprio : ${owner.user.tag} (${owner.id})`)
        if(client.utilsCache.get(`leavereason_${guild.id}`) === 1) return
        let {owners} = await client.functions.getOwners(client, guild.id)
        let allOwnersIds = []
        owners.map(m => allOwnersIds.push(m))
        let peopleToContact = []
        client.config.buyers.map(b => peopleToContact.push(b))
        allOwnersIds.filter(i => !peopleToContact.includes(i)).map(i => peopleToContact.push(i))

        const embed = new Discord.MessageEmbed()
        embed.setDescription(`J'ai quitté le serveur **${guild.name}** !\nPropriétaire : \`${owner.user.tag} (${owner.id})\`\nMembres : ${guild.memberCount}`)
        embed.setColor('RED')
        embed.setFooter(client.config.footer)
        embed.setTimestamp()
        peopleToContact.map(async (id, n) => {
            let user = client.users.cache.find(m => m.id === id)
            if (!user) return
            user?.send({ embeds: [embed] }).catch(e => { })
        })
    }
}