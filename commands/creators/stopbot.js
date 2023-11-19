const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
module.exports = {
    name: "stopbot",
    aliases: ['killbot'],

    /**
    * @param {Mxtorie} client
    * @param {Discord.Message} message
    */
    run: async (client, message, args, command_name) => {
        if (!client.creators.includes(message.author.id)) return
        client.db.delete(`restartchan`, message.channel.id)
        client.db.set('killbot', { killed: false })
        message.channel.send(`Arrêt du bot...`).then(m => {
            return process.exit(255)
        }).catch(e => { client.db.delete('killbot') })
    }
}