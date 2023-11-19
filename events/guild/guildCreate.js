const Discord = require('discord.js-mxtorie')
const { Mxtorie } = require('../../structures/client')
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'guildCreate',

    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Guild} guild
     */
    run: async (client, guild) => {
        if (!guild.available) return

        await guild.fetch().catch(e => { })
        await guild.members.fetch().catch(e => { })
        console.log(`Je viens de rejoindre :`)
        console.log(guild.name)
        console.log(`Membres : ${guild.memberCount}`)
        let owner = await guild.fetchOwner()
        console.log(`Proprio : ${owner.user.tag} (${owner.id})`)

        let {owners} = await client.functions.getOwners(client, guild.id)
        let allOwnersIds = []
        owners.map(m => allOwnersIds.push(m))
        let peopleToContact = []
        client.config.buyers.map(b => peopleToContact.push(b))
        allOwnersIds.filter(i => !peopleToContact.includes(i)).map(i => peopleToContact.push(i))
        let canStayInGuild = guild.members.cache.filter(m => peopleToContact.includes(m.id)).size > 0
        if (!canStayInGuild && guild.ownerId !== client.user.id && guild.id !== "855557733389959188") {
            client.utilsCache.set(`leavereason_${guild.id}`, 1)
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`J'ai rejoint le serveur **${guild.name}** !\nPropriétaire : \`${owner.user.tag} (${owner.id})\`\nMembres : ${guild.memberCount}\n\n**Je l'ai quitté car aucun owners/buyers n'était présent.**`)
            embed.setColor('RED')
            embed.setFooter(client.config.footer)
            embed.setTimestamp()
            peopleToContact.map(async (id, n) => {
                let user = client.users.cache.find(m => m.id === id)
                if (user) return
                user?.send({ embeds: [embed] }).catch(e => { })
            })
            guild.leave().catch(e=>{})
        } else {
            client.utilsCache.delete(`leavereason_${guild.id}`)
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`J'ai rejoint le serveur **${guild.name}** !\nPropriétaire : \`${owner.user.tag} (${owner.id})\`\nMembres : ${guild.memberCount}`)
            embed.setColor('GREEN')
            embed.setFooter(client.config.footer)
            embed.setTimestamp()
            if (guild.id !== '855557733389959188') peopleToContact.map(async (id, n) => {
                let user = client.users.cache.find(m => m.id === id)
                if (!user) return
                user?.send({embeds: [embed]}).catch(e => {
                })
            })
            config()
            syncInvites()
            syncInvitesMembersStats()

            async function config() {
                guild.commands.set(client.slashCommands).catch(e => { })
            }

            async function syncInvites(){
                guild.invites.fetch().then(async inv => {
                    inv.map(async invite => {
                        if (client.allInvites.has(guild.id)) {
                            let current = client.allInvites.get(guild.id)
                            let data = {
                                code: invite.code,
                                uses: invite.uses,
                                author: invite.inviter.id
                            }
                            current.push(data)
                            client.allInvites.set(guild.id, current)
                        } else {
                            client.allInvites.set(guild.id, [{
                                code: invite.code,
                                uses: invite.uses,
                                author: invite.inviter.id
                            }])
                        }
                    })
                }).catch(err => { })
                if (guild.features.includes('VANITY_URL')) {
                    guild.fetchVanityData().then(vani => {
                        client.vanityCount.set(guild.id, vani.uses)
                    }).catch(err => { })
                }
            }

            async function syncInvitesMembersStats(){
                guild.members.cache.map(async member => {
                    if (!member) return
                    let hasInInvite = client.db.has('invitesStats_' + guild.id + '_' + member.id)
                    if (!hasInInvite) client.db.set('invitesStats_' + guild.id + '_' + member.id, { userid: member.id, allinvites: 0, allvalid: 0, invalid: 0, bonus: 0, suspect: 0 })
                })
            }
        }
    }
}