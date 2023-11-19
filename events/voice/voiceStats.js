const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const Activites = new Map()

module.exports = {
    name: 'voiceStateUpdate',
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.VoiceState} oldState
     * @param {Discord.VoiceState} newState
     */
    run: async(client, oldState, newState)=>{
        if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
        if(!oldState.channelId && newState.channelId) {
            Activites.set(oldState.id, Date.now());
        }
        let data;
        if(!Activites.has(oldState.id)){
            data = Date.now();
            Activites.set(oldState.id, data);
        }
        else
            data = Activites.get(oldState.id);
        let duration = Date.now() - data;
        if(oldState.channelId && !newState.channelId) {
            Activites.delete(oldState.id);
            client.db.add(`stats_voice_${oldState.guild.id}_${oldState.id}_channels_${oldState.channelId}`, duration);
            client.db.set(`stats_voice_${newState.guild.id}_${newState.id}_activity`, Date.now());
        }
        else if(oldState.channelId && newState.channelId){
            Activites.set(oldState.id, Date.now());
            client.db.add(`stats_voice_${oldState.guild.id}_${oldState.id}_channels_${oldState.channelId}`, duration);
            client.db.set(`stats_voice_${oldState.guild.id}_${oldState.id}_activity`, Date.now());
        }
    }
}