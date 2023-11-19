const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
module.exports = {
    name: "uptime",
    aliases: [],

    /**
    * @param {Mxtorie} client
    * @param {Discord.Message} message
    */
    run: async (client, message, args, command_name) => {
        if (!client.creators.includes(message.author.id)) return
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let result = `${days === 0 ? '' : `${days} ${days === 1 ? "jour" : "jours"} `}${hours === 0 ? '' : `${hours} ${hours === 1 ? "heure" : "heures"} `}${minutes === 0 ? '' : `${minutes} ${minutes === 1 ? "minute" : "minutes"} `}${seconds === 0 ? "" : `${seconds} ${seconds === 1 ? 'seconde' : 'secondes'}`}`

        const embed = new Discord.MessageEmbed()
        embed.setTitle("Uptime")
        embed.setDescription(result)
        embed.setColor("DARK_VIVID_PINK")
        embed.setTimestamp()
        return message.channel.send({ embeds: [embed] })
    }
}