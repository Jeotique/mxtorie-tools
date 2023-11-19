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
        if (data.authorid === user.id) return client.emit('leaveInviteHimself', guild, user)
        if (data.code === 'unknow') return client.emit('leaveInviteUnknow', guild, user)
        if (data.code === 'vanity') return client.emit('leaveInviteVanity', guild, user)
        let dataInvite = client.db.get('invitesStats_' + guild.id + '_' + data.authorid)
        if (!dataInvite) return
        let allInvites = await guild.invites.fetch().catch(e=>{})
        let inviteUsed = allInvites.find(inv => inv.code === data.code)
        if (!inviteUsed) inviteUsed = data
        inviteUsed.data = dataInvite
        return client.emit('leaveInviteSomeone', guild, user, inviteUsed)
    }
}