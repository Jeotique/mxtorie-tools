const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const moment = require('moment')
module.exports = {
    name: 'addInvite',

    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Guild} guild
     * @param {string} memberid
     * @param {number} count
     */
    run: async (client, guild, memberid, count) => {
        try {
            checkEvents()
            let hasInfo = client.db.has('invitesStats_'+guild.id+'_'+memberid)
            if(hasInfo){
                let Allcurrent = client.db.get('invitesStats_'+guild.id+'_'+memberid)
                let current = Allcurrent
                current.allinvites = current.allinvites+count
                current.allvalid = current.allvalid+count
                await client.db.set('invitesStats_'+guild.id+'_'+memberid, current)
                for(let i = 0; i < current.allvalid; ++i){
                    let recomp = client.db.get(`recomp_${guild.id}_${i}`)
                    if(!recomp) return
                    let mt = guild.members.cache.find(m=>m.id===memberid)
                    if(!mt) return
                    mt.roles.add(recomp, `Récompense ${i} invitations`)
                }
            } else {
                client.db.set('invitesStats_'+guild.id+'_'+memberid, {userid: memberid, allinvites: count, allvalid: count, invalid: 0, bonus: 0, suspect: 0})
            }

            async function checkEvents(){
                let allEvents = client.db.get(`invite_events_${guild.id}`) || []
                if(allEvents.length < 1) return
                allEvents.map(event => {
                    if(!event.data.find(d => d.userId === memberid)) {
                        event.data.push({
                            userId: memberid,
                            allinvites: count,
                            allvalid: count,
                            invalid: 0,
                            bonus: 0,
                            suspect: 0
                        })
                        client.db.set(`invite_events_${guild.id}`, allEvents)
                    } else {
                        let user_data = event.data.find(d => d.userId === memberid)
                        user_data.allinvites = user_data.allinvites+count
                        user_data.allvalid = user_data.allvalid+count
                        event.data = event.data.filter(d => d.userId !== memberid)
                        event.data.push(user_data)
                        client.db.set(`invite_events_${guild.id}`, allEvents)
                    }
                })
            }
        } catch (err) {
            console.log('Add invite event error : ' + err)
        }
    }
}