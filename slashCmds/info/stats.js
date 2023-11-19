const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const moment = require('moment')
require("moment-duration-format");
module.exports = {
    name: 'stats',
    description: "Affiche les stats d'un membre",
    type: "CHAT_INPUT",
    options: [{
        name: 'membre',
        description: "De qui voulez-vous voir les stats ?",
        type: 'USER',
        required: false
    }],
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        /* let {owners} = await client.functions.getOwners(client, interaction.guildId)
         if(!owners.includes(interaction.user.id) && !client.config.buyers.includes(interaction.user.id) && !client.creators.includes(interaction.user.id) && !interaction.memberPermissions.has("MANAGE_GUILD"))
             return interaction.followUp({content: "Vous n'avez pas les permissions nécessaire."}).catch(e=>{})*/
        let mention = interaction.options.getMember("membre") || interaction.member
        let inviteData = client.db.get(`invitesStats_${interaction.guildId}_${mention.id}`) || {
            allinvites: 0,
            allvalid: 0,
            invalid: 0,
            bonus: 0,
            suspect: 0
        }
        let joinCount = client.db.get(`joincount_${interaction.guildId}_${mention.id}`) || '1e'
        let allVoiceData = client.db.all().filter(a => a.key.startsWith(`stats_voice_${interaction.guildId}_${mention.id}_channels`))
        let voiceData = {voice: client.db.get(`stats_voice_${interaction.guildId}_${mention.id}_activity`) || 0, channels: {}}
        if(!allVoiceData) voiceData = {voice: client.db.get(`stats_voice_${interaction.guildId}_${mention.id}_activity`)  || 0, channels: {}}
        else allVoiceData.map(vd => {
            voiceData.channels[vd.key.split('_')[5]] = vd.data
        })
        let allMessageData = client.db.all().filter(a => a.key.startsWith(`stats_message_${interaction.guildId}_${mention.id}_channels`))
        let messageData = {messages: client.db.get(`stats_message_${interaction.guildId}_${mention.id}_activity`) || 0, channels: {}}
        if(!allMessageData) messageData = {messages: client.db.get(`stats_message_${interaction.guildId}_${mention.id}_activity`) || 0, channels: {}}
        else allMessageData.map(vd => {
            messageData.channels[vd.key.split('_')[5]] = vd.data
        })

        let voiceList = Object.keys(voiceData.channels).map(vd => {
            return {
                Id: vd,
                Total: voiceData.channels[vd]
            };
        }).sort((a, b) => b.Total - a.Total);

        let messageList = Object.keys(messageData.channels).map(md => {
            return {
                Id: md,
                Total: messageData.channels[md]
            };
        }).sort((a, b) => b.Total - a.Total);
        voiceList = voiceList.length > 10 ? voiceList.splice(0, 10) : voiceList;
        voiceList = voiceList.map((vd, index)=> `\`${index + 1}.\` ${client.channels.cache.has(vd.Id) ? client.channels.cache.get(vd.Id).toString() : "#salon-introuvable"}: \`${moment.duration(vd.Total).format("H [hours] m [minutes], s [seconds]")}\``).join("\n").replaceAll('seconds', 'secondes').replaceAll('hours', 'heures');
        messageList = messageList.length > 10 ? messageList.splice(0, 10) : messageList;
        messageList = messageList.map((md, index)=> `\`${index + 1}.\` ${client.channels.cache.has(md.Id) ? client.channels.cache.get(md.Id).toString() : "#salon-introuvable"}: \`${md.Total} message(s)\``).join("\n");
        let totalMessageCount = 0;
        let totalVoiceCount = 0;
        Object.keys(voiceData.channels).map(k => totalVoiceCount += voiceData.channels[k])
        Object.keys(messageData.channels).map(k => totalMessageCount += messageData.channels[k])
        let embed = new Discord.MessageEmbed();
        embed.setColor(mention.displayHexColor)
            .setFooter(client.config.footer)
            .setThumbnail(mention.displayAvatarURL({dynamic: true}))
            .addField("Informations",` 
    
**__ID :__** \`${mention.user.id}\` 
**__Rôles :__** ${mention.roles.cache.filter(r => r.id !== interaction.guildId).size < 1 ? "_aucun rôle..._":mention.roles.cache.filter(r => r.id !== interaction.guildId).size >= 5 ? "_Trop de rôles..._" : mention.roles.cache.filter(r => r.id !== interaction.guildId).map(role => role.toString())}
**__Pseudo :__** \`${mention.user.tag}\`
    `)
            .addField("Activité vocal", `
Temps total : \`${moment.duration(totalVoiceCount).format("H [hours] m [minutes], s [seconds]").replaceAll('seconds', 'secondes').replaceAll('hours', 'heures')}\`
Dernière activitée : ${voiceData.voice < 1 ? `aucune donnée`:`<t:${voiceData.voice.toString().slice(0, -3)}:R>`}
** **${voiceList}
    `)
            .addField("Activité message", `
Niveau : \`${client.db.has(`${interaction.guildId}_${mention.id}_level`)?client.db.get(`${interaction.guildId}_${mention.id}_level`):0}\`
Nombre total : \`${totalMessageCount} message(s)\`
Dernière activitée : ${messageData.messages < 1 ? `aucune donnée`:`<t:${messageData?.messages?.toString().slice(0, -3)}:R>`}
** **${messageList}
    `)
            .addField("Implication serveur", `
Invitation total : \`${inviteData.allinvites}\`
Invitation valide : \`${inviteData.allvalid}\`
Il a rejoint \`${joinCount.replace('e','')}\` fois le serveur
La dernière fois qu'il a rejoint date d'il y a <t:${mention.joinedTimestamp.toString().slice(0, -3)}:R>
            `)

        interaction.followUp({embeds: [embed]}).catch(e=>{})
    }
}