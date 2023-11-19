const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const Activites = new Map()

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.Message} message
     */
    run: async(client, message)=>{
        if(message.author.bot || message.content.startsWith(client.config.prefix)) return;

        client.db.add(`stats_message_${message.guild.id}_${message.author.id}_channels_${message.channelId}`, 1);
        client.db.set(`stats_message_${message.guild.id}_${message.author.id}_activity`, Date.now());
    }
}