const Discord = require('discord.js-mxtorie')
const {Mxtorie} = require('../../structures/client')
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'inviteDelete',

    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Invite} invite
     */
    run: async (client, invite) => {
        if(!invite.guild) return
        if(client.allInvites.has(invite.guild.id)){
            let current = client.allInvites.get(invite.guild.id)
            let thenew = current.filter(v=> v.code !== invite.code)
            client.allInvites.set(invite.guild.id, thenew)
        }
    }
}