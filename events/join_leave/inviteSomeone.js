const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: "inviteSomeone",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Guild} guild
     * @param {Discord.GuildMember} member
     */
    run: async(client, guild, member) => {
        let hasInInvite = client.db.has('invitesStats_' + guild.id + '_' + member.id)
        if (!hasInInvite) client.db.set('invitesStats_' + guild.id + '_' + member.id, { userid: member.id, allinvites: 0, allvalid: 0, invalid: 0, bonus: 0, suspect: 0 })
        const channelId = client.db.get(`welcomechannel_${guild.id}`)
        const channel = guild.channels.cache.find(c => c.id === channelId)
        if(!channel) return
        let allData = client.db.get('invites_' + guild.id)
        let currentData = allData[allData.length - 1]
        let allInvites = await guild.invites.fetch().catch(e=>{})
        let theInv = allInvites.find(v => v.code === currentData.code)
        if (!theInv) return client.emit('unknowInvite', guild, member)
        const embedData = client.db.get(`welcomeembed_${guild.id}`) || client.defaultVariables.welcomeEmbed
        if(client.db.get(`welcome_isembed_${guild.id}`)){
            let theInv = allInvites.find(v => v.code === currentData.code)
            if (!theInv) return client.emit('unknowInvite', guild, member)
            let inviterInfo = client.db.get('invitesStats_' + guild.id + '_' + currentData.authorid)
            theInv.data = inviterInfo
            Object.keys(client.variablesReplace.joinNormal).map(key => {
                if(embedData.title) if(embedData.title.includes(key)) embedData.title = embedData.title.replaceAll(key, client.variablesReplace.joinNormal[key](member, guild, theInv, theInv.inviter, client.db))
                if(embedData.description) if(embedData.description.includes(key)) embedData.description = embedData.description.replaceAll(key, client.variablesReplace.joinNormal[key](member, guild, theInv, theInv.inviter, client.db))
                if(embedData.footer) {
                    if(embedData.footer.text) if(embedData.footer.text.includes(key)) embedData.footer.text = embedData.footer.text.replaceAll(key, client.variablesReplace.joinNormal[key](member, guild, theInv, theInv.inviter, client.db))
                }
                if(embedData.author){
                    if(embedData.author.name) if(embedData.author.name.includes(key)) embedData.author.name = embedData.author.name.replaceAll(key, client.variablesReplace.joinNormal[key](member, guild, theInv, theInv.inviter, client.db))
                }
                if(embedData.fields){
                    embedData.fields.map(f => {
                        if(f.title) if(f.title.includes(key)) f.title = f.title.replaceAll(key, client.variablesReplace.joinNormal[key](member, guild, theInv, theInv.inviter, client.db))
                        if(f.description) if(f.description.includes(key)) f.description = f.description.replaceAll(key, client.variablesReplace.joinNormal[key](member, guild, theInv, theInv.inviter, client.db))
                    })
                }
            })
            if(embedData.timestamp) embedData.timestamp = Date.now()
            let embed = new Discord.MessageEmbed(embedData)
            return channel.send({embeds: [embed]}).then(msg => {
                let deleteAfter = client.db.get(`welcome_deleteafter_${guild.id}`)
                if(!deleteAfter) return
                setTimeout(()=>{
                    msg.delete().catch(e=>{})
                }, deleteAfter)
            })
        }else{
            let theInv = allInvites.find(v => v.code === currentData.code)
            if (!theInv) return client.emit('unknowInvite', guild, member)
            let inviterInfo = client.db.get('invitesStats_' + guild.id + '_' + currentData.authorid)
            theInv.data = inviterInfo
            let brutMessage = client.db.get(`welcomemessage_${guild.id}`) || client.defaultVariables.welcomeMessage
            Object.keys(client.variablesReplace.joinNormal).map(key => {
                if(brutMessage.includes(key)) brutMessage = brutMessage.replaceAll(key, client.variablesReplace.joinNormal[key](member, guild, theInv, theInv.inviter, client.db))
            })
            return channel.send(brutMessage).then(msg => {
                let deleteAfter = client.db.get(`welcome_deleteafter_${guild.id}`)
                if(!deleteAfter) return
                setTimeout(()=>{
                    msg.delete().catch(e=>{})
                }, deleteAfter)
            })
        }
    }
}