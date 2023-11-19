const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const Activites = new Map()

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Message} message
     */
    run: async(client, message)=> {
        if (!message) return
        if (!message.guild) return
        if (!message.author) return
        if (message.author.bot) return
        await message.guild.members.fetch(message.author.id).catch(e => {
            return
        })
        client.db.add(`messages_${message.guild.id}_${message.author.id}`, 1);
        client.db.add(`messageslevel_${message.guild.id}_${message.author.id}`, 1);
        let messagefetch = client.db.get(`messages_${message.guild.id}_${message.author.id}`);
        let messagefetchLvl = client.db.get(`messageslevel_${message.guild.id}_${message.author.id}`);
        let messages;
        let msgcount = 50
        if (messagefetchLvl >= msgcount) {

            client.db.set(`messageslevel_${message.guild.id}_${message.author.id}`, 0);
            client.db.add(`${message.guild.id}_${message.author.id}_level`, 1);
            let levelfetch = await client.db.get(`${message.guild.id}_${message.author.id}_level`);
            levelUpMessage()
            let rolereward = await client.db.get(`reward_${message.guild.id}_${levelfetch}`)
            if (rolereward) {
                if (message.guild.roles.cache.has(rolereward)) {
                    message.member.roles.add(rolereward, 'récompense niveau ' + levelfetch).catch(e => {
                    })
                }
            }
        }

        async function levelUpMessage(){
            const {guild, member} = message
            const channelId = client.db.get(`levelupchannel_${guild.id}`)
            const channel = guild.channels.cache.find(c => c.id === channelId)
            if(!channel) return
            const embedData = client.db.get(`levelupembed_${guild.id}`) || client.defaultVariables.levelupEmbed
            if(client.db.get(`levelup_isembed_${guild.id}`)){
                Object.keys(client.variablesReplace.levelUp).map(key => {
                    if(embedData.title) if(embedData.title.includes(key)) embedData.title = embedData.title.replaceAll(key, client.variablesReplace.levelUp[key](member, guild,client.db, message.channel))
                    if(embedData.description) if(embedData.description.includes(key)) embedData.description = embedData.description.replaceAll(key, client.variablesReplace.levelUp[key](member, guild, client.db, message.channel))
                    if(embedData.footer) {
                        if(embedData.footer.text) if(embedData.footer.text.includes(key)) embedData.footer.text = embedData.footer.text.replaceAll(key, client.variablesReplace.levelUp[key](member, guild, client.db, message.channel))
                    }
                    if(embedData.author){
                        if(embedData.author.name) if(embedData.author.name.includes(key)) embedData.author.name = embedData.author.name.replaceAll(key, client.variablesReplace.levelUp[key](member, guild, client.db, message.channel))
                    }
                    if(embedData.fields){
                        embedData.fields.map(f => {
                            if(f.title) if(f.title.includes(key)) f.title = f.title.replaceAll(key, client.variablesReplace.levelUp[key](member, guild, client.db, message.channel))
                            if(f.description) if(f.description.includes(key)) f.description = f.description.replaceAll(key, client.variablesReplace.levelUp[key](member, guild, client.db, message.channel))
                        })
                    }
                })
                if(embedData.timestamp) embedData.timestamp = Date.now()
                let embed = new Discord.MessageEmbed(embedData)
                return channel.send({embeds: [embed]}).then(msg => {
                    let deleteAfter = client.db.get(`levelup_deleteafter_${guild.id}`)
                    if(!deleteAfter) return
                    setTimeout(()=>{
                        msg.delete().catch(e=>{})
                    }, deleteAfter)
                })
            }else{
                let brutMessage = client.db.get(`levelupmessage_${guild.id}`) || client.defaultVariables.levelupMessage
                Object.keys(client.variablesReplace.levelUp).map(key => {
                    if(brutMessage.includes(key)) brutMessage = brutMessage.replaceAll(key, client.variablesReplace.levelUp[key](member, guild, client.db, message.channel))
                })
                return channel.send(brutMessage).then(msg => {
                    let deleteAfter = client.db.get(`levelup_deleteafter_${guild.id}`)
                    if(!deleteAfter) return
                    setTimeout(()=>{
                        msg.delete().catch(e=>{})
                    }, deleteAfter)
                })
            }
        }
    }
}