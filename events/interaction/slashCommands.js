const Discord = require('discord.js-mxtorie')
const {Mxtorie} = require('../../structures/client')
const chalk = require('chalk')
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'interactionCreate',

    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        if(!interaction.isApplicationCommand()) return
        const command = client.slashCommands.get(interaction.commandName)
        if(!command) return
        command.run(client, interaction)

        let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
        let dateTime = `${new Date().getDate()}/${(new Date().getMonth() + 1)}/${new Date().getFullYear()}`
        print(`${dateTime} | ${getNow().time} - ${chalk.green(interaction.guild.name)} : ${chalk.yellow(interaction.commandName)} | ${interaction.user.tag}`)
    }
}