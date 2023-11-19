const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const moment = require('moment')
module.exports = {
    name: 'guildMemberRemove',

    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.GuildMember} user
     */
    run: async (client, user) => {
        if (!user.guild) return
        const guild = user.guild
        if (!guild) return
        let allData = await client.db.get('invites_' + guild.id)
        if (!allData) return
        if (allData.length < 1) return
        allData = allData.filter(v => v.userid === user.id)
        let data = allData[allData.length - 1]
        if(!data) return
        if (data.code === 'unknow') return
        if (data.code === 'vanity') return
        let dataInvite = client.db.get('invitesStats_' + guild.id + '_' + data.authorid)
        if (!dataInvite) return
        let { allvalid, invalid } = dataInvite
        let oldCount = allvalid
        allvalid--
        invalid++
        dataInvite.allvalid = allvalid
        dataInvite.invalid = invalid
        client.db.set('invitesStats_' + guild.id + '_' + data.authorid, dataInvite)
        checkEvents()
        for (let i = oldCount; i > dataInvite.allvalid; --i) {
            let recomp = client.db.get(`recomp_${guild.id}_${i}`)
            if (!recomp) return
            let mt = guild.members.cache.find(m => m.id === data.authorid)
            if (!mt) return
            mt.roles.remove(recomp, `Perte de récompense ${i} invitations`)
        }

        async function checkEvents(){
            let allEvents = client.db.get(`invite_events_${guild.id}`) || []
            if(allEvents.length < 1) return
            allEvents.map(event => {
                if(!event.data.find(d => d.userId === data.authorid)) {
                    event.data.push({
                        userId: data.authorid,
                        allinvites: 0,
                        allvalid: 0,
                        invalid: 0,
                        bonus: 0,
                        suspect: 0
                    })
                    client.db.set(`invite_events_${guild.id}`, allEvents)
                } else {
                    let user_data = event.data.find(d => d.userId === data.authorid)
                    user_data.invalid++
                    user_data.allvalid--
                    event.data = event.data.filter(d => d.userId !== data.authorid)
                    event.data.push(user_data)
                    client.db.set(`invite_events_${guild.id}`, allEvents)
                }
            })
        }
    }
}