const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: "leaveInviteSomeone",
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Guild} guild
     * @param {Discord.GuildMember} member
     * @param {Discord.Invite} theInv
     */
    run: async(client, guild, member, theInv) => {
        const channelId = client.db.get(`leavechannel_${guild.id}`)
        const channel = guild.channels.cache.find(c => c.id === channelId)
        if(!channel) return
        const embedData = client.db.get(`leaveembed_${guild.id}`) || client.defaultVariables.leaveEmbed
        if(client.db.get(`leave_isembed_${guild.id}`)){
            Object.keys(client.variablesReplace.leaveNormal).map(key => {
                if(embedData.title) if(embedData.title.includes(key)) embedData.title = embedData.title.replaceAll(key, client.variablesReplace.leaveNormal[key](member, guild, theInv, theInv.inviter, client.db))
                if(embedData.description) if(embedData.description.includes(key)) embedData.description = embedData.description.replaceAll(key, client.variablesReplace.leaveNormal[key](member, guild, theInv, theInv.inviter, client.db))
                if(embedData.footer) {
                    if(embedData.footer.text) if(embedData.footer.text.includes(key)) embedData.footer.text = embedData.footer.text.replaceAll(key, client.variablesReplace.leaveNormal[key](member, guild, theInv, theInv.inviter, client.db))
                }
                if(embedData.author){
                    if(embedData.author.name) if(embedData.author.name.includes(key)) embedData.author.name = embedData.author.name.replaceAll(key, client.variablesReplace.leaveNormal[key](member, guild, theInv, theInv.inviter, client.db))
                }
                if(embedData.fields){
                    embedData.fields.map(f => {
                        if(f.title) if(f.title.includes(key)) f.title = f.title.replaceAll(key, client.variablesReplace.leaveNormal[key](member, guild, theInv, theInv.inviter, client.db))
                        if(f.description) if(f.description.includes(key)) f.description = f.description.replaceAll(key, client.variablesReplace.leaveNormal[key](member, guild, theInv, theInv.inviter, client.db))
                    })
                }
            })
            if(embedData.timestamp) embedData.timestamp = Date.now()
            let embed = new Discord.MessageEmbed(embedData)
            return channel.send({embeds: [embed]}).then(msg => {
                let deleteAfter = client.db.get(`leave_deleteafter_${guild.id}`)
                if(!deleteAfter) return
                setTimeout(()=>{
                    msg.delete().catch(e=>{})
                }, deleteAfter)
            })
        }else{
            let brutMessage = client.db.get(`leavemessage_${guild.id}`) || client.defaultVariables.leaveMessage
            Object.keys(client.variablesReplace.leaveNormal).map(key => {
                if(brutMessage.includes(key)) brutMessage = brutMessage.replaceAll(key, client.variablesReplace.leaveNormal[key](member, guild, theInv, theInv.inviter, client.db))
            })
            return channel.send(brutMessage).then(msg => {
                let deleteAfter = client.db.get(`leave_deleteafter_${guild.id}`)
                if(!deleteAfter) return
                setTimeout(()=>{
                    msg.delete().catch(e=>{})
                }, deleteAfter)
            })
        }
    }
}