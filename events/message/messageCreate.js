const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require('fs')
const chalk = require('chalk')

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Mxtorie} client 
     * @param {Discord.Message} message 
     */
    run: async (client, message) => {
        if (!message.guild || !message.author) return
        if (message.author.bot) return
        let prefix = client.db.get(`prefix_${message.guildId}`) || client.config.prefix
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) prefix = `<@${client.user.id}>`
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) prefix = `<@${client.user.id}> `
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) prefix = `<@!${client.user.id}>`
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) prefix = `<@!${client.user.id}> `
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) return
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const commandName = args[0].toLowerCase().normalize()
        const cmd = client.commands.get(commandName) || client.aliases.get(commandName)
        if (!cmd) return
        args.shift()
        cmd.run(client, message, args, cmd.name)
    }
}