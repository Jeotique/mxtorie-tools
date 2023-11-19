const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
module.exports = {
    name: "reload",
    aliases: [],

    /**
    * @param {Mxtorie} client
    * @param {Discord.Message} message
    */
    run: async (client, message, args, command_name) => {
        if (!client.creators.includes(message.author.id)) return
        if (!args[0]) return message.channel.send("Nom de la commande manquant.")
        const cmd = client.commands.get(args[0]) || client.aliases.get(args[0])
        if (!cmd) return message.channel.send("Commande inexistante.")
        let category = cmd.category
        let nameFile = cmd.commandFile
        client.commands.delete(cmd.name)
        if (cmd.aliases && cmd.aliases.length > 0) {
            cmd.aliases.map(alias => client.aliases.delete(alias))
        }
        delete require.cache[require.resolve(`../${category}/${nameFile}`)]
        const newCmd = require(`../${category}/${nameFile}`)
        if (!newCmd) return message.channel.send("Une erreur est survenue, je n'ai pas pu reload la commande.")
        newCmd.category = category
        newCmd.commandFile = nameFile
        client.commands.set(newCmd.name, newCmd)
        if (newCmd.aliases && newCmd.aliases.length > 0) {
            newCmd.aliases.map(alias => client.aliases.set(alias, newCmd))
        }
        return message.channel.send("Commande rechargée.")
    }
}