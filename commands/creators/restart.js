const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
module.exports = {
    name: "restart",
    aliases: ['restartbot'],

    /**
    * @param {Mxtorie} client
    * @param {Discord.Message} message
    */
    run: async (client, message, args, command_name) => {
        if (!client.creators.includes(message.author.id)) return
        if (args[0] !== 'client') {
            await client.db.set(`restartchan`, message.channel.id)
            message.channel.send(`Redémarrage...`).then(m => {
                return process.exit()
            }).catch(e => { client.db.delete('restartchan') })
        } else {
            await client.db.set(`restartchan`, message.channel.id)
            message.channel.send(`Redémarrage...`).then(m => {
                client.destroy()
                return new Mxtorie()
            }).catch(e => { client.db.delete('restartchan') })
        }
    }
}