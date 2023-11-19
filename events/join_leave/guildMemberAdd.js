const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.GuildMember} member
     */
    run: async(client, member) => {
        const {guild} = member
        if(!guild) return
        client.db.add(`joincount_${guild.id}_${member.id}`, 1)
        if(member.user.bot){
            const audit = await guild.fetchAuditLogs({limit: 1, type: "BOT_ADD"}).catch(e=>{})
            if(!audit) return
            const log = audit.entries.first()
            if(!log) return
            if(Date.now() - log.createdTimestamp > 5000) return
            return client.emit('botAdded', guild, member, log.executor)
        } else {
            let currentInvites = await guild.invites.fetch().catch(e=>{})
            if(!currentInvites) return
            let cachedInvites = client.allInvites.get(guild.id)
            if(!cachedInvites) return
            let inviteUsed = currentInvites.find(inv => inv.uses > cachedInvites.find(c => c.code === inv.code).uses)
            if(inviteUsed){
                client.db.push('invites_' + guild.id, { userid: member.id, code: inviteUsed.code, uses: inviteUsed.uses, authorid: inviteUsed.inviterId, authortag: inviteUsed.inviter.username + '#' + inviteUsed.inviter.discriminator, author: inviteUsed.inviter.username, date: member.joinedTimestamp })
                let allData = client.allInvites.get(guild.id)
                let nowData = allData.filter(v => v.code !== inviteUsed.code)
                let data = {
                    code: inviteUsed.code,
                    uses: inviteUsed.uses,
                    author: inviteUsed.inviter.id
                }
                nowData.push(data)
                client.allInvites.set(guild.id, nowData)
                if(inviteUsed.inviterId === member.id) return client.emit("inviteHimself", guild, member)
                if(Date.now() - member.user.createdTimestamp < 1728000000) [client.emit('addSuspectInvite', guild, inviteUsed.inviterId, 1), console.log('suspect')]
                else client.emit('addInvite', guild, inviteUsed.inviterId, 1)
                await client.functions.sleep(1000)
                return client.emit("inviteSomeone", guild, member)
            } else {
                if (!guild.features.includes('VANITY_URL')) {
                    client.db.push('invites_' + guild.id, { userid: member.id, code: 'unknow', uses: 0, authorid: 'unknow', authortag: 'unknow', author: 'unknow', date: member.joinedTimestamp })
                    return client.emit('unknowInvite', guild, member)
                } else {
                    guild.fetchVanityData().then(async vani => {
                        let usesInCache = client.vanityCount.get(guild.id)
                        if (vani.uses <= usesInCache) {
                            client.vanityCount.set(guild.id, vani.uses);
                            client.db.push('invites_' + guild.id, { userid: member.id, code: 'unknow', uses: 0, authorid: 'unknow', authortag: 'unknow', author: 'unknow', date: member.joinedTimestamp })
                            return client.emit('unknowInvite', guild, member)
                        } else {
                            client.vanityCount.set(guild.id, vani.uses);
                            client.db.push('invites_' + guild.id, { userid: member.id, code: 'vanity', uses: vani.uses, authorid: 'unknow', authortag: 'unknow', author: 'unknow', date: member.joinedTimestamp })
                            return client.emit('inviteVanity', guild, member)
                        }
                    }).catch(async e => {
                        client.db.push('invites_' + guild.id, { userid: member.id, code: 'unknow', uses: 0, authorid: 'unknow', authortag: 'unknow', author: 'unknow', date: member.joinedTimestamp })
                        return client.emit('unknowInvite', guild, member)
                    })
                }
            }
        }
    }
}