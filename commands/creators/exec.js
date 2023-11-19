const { Mxtorie } = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
module.exports = {
    name: "exec",
    aliases: ["ex"],

    /**
    * @param {Mxtorie} client
    * @param {Discord.Message} message
    */
    run: async (client, message, args, command_name) => {
        if (!client.creators.includes(message.author.id)) return


        const content = message.content.split(" ").slice(1).join(" ");
        const result2 = new Promise((resolve) => resolve(eval(content)));
        return result2.then((output) => {
            if (typeof output !== "string") {
                output = require("util").inspect(output, { depth: 0 });
            }
            if (output.includes(`${client.config.token}`)) {
                output = output.replace(`${client.config.token}`, "T0K3N");
            }
        }).catch((err) => {
            err = err.toString();
            if (err.includes(`${client.config.token}`)) {
                err = err.replace(`${client.config.token}`, "T0K3N");
            }
            let embed = new Discord.MessageEmbed()
            embed.setColor(client.config.color)
            embed.setDescription(`\`\`\`js\n${err}\n\`\`\``)
            embed.setFooter({ text: `${client.config.name} V5 | Convert Js to C# with Apolojize` })
            message.channel.send({ embeds: [embed] });
        });
    }
}