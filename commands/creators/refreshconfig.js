const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
module.exports = {
    name: "refreshconfig",
    aliases: ['configrefresh'],

    /**
    * @param {Mxtorie} client
    * @param {Discord.Message} message
    */
    run: async (client, message, args, command_name) => {
        if (!client.creators.includes(message.author.id)) return
        client.refreshConfig()
        return message.channel.send(`Fichier config rechargé.`)
    }
}