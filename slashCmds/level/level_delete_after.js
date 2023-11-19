const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'level_delete_after',
    description: "Définie après combien de temps le message de levelup ce supprime.",
    type: "CHAT_INPUT",
    options: [{
            name: 'temps',
            description: "Quel sera le temps avant que le message soit supprimé ? off : désactivé.",
            type: 'STRING',
            required: true
        }],
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        let {owners} = await client.functions.getOwners(client, interaction.guildId)
        if(!owners.includes(interaction.user.id) && !client.config.buyers.includes(interaction.user.id) && !client.creators.includes(interaction.user.id) && !interaction.memberPermissions.has("MANAGE_GUILD"))
            return interaction.followUp({content: "Vous n'avez pas les permissions nécessaire."}).catch(e=>{})
        let askedTime = interaction.options.getString("temps")
        if(askedTime.toLowerCase()==="off"){
            client.db.delete(`levelup_deleteafter_${interaction.guildId}`);
            return interaction.followUp({content: "Le message restera dans le chat."}).catch(e=>{})
        } else {
            let time = client.ms(askedTime)
            if(!time) return interaction.followUp({content: "Le temps est invalide."}).catch(e=>{})
            if(time <= 0) return interaction.followUp({content: "Le temps ne peut pas être inférieur ou égal à 0 ms."}).catch(e=>{})
            if(time > 1296000000) return interaction.followUp({content: "Le temps ne peut pas être plus grand que 15 jours."}).catch(e=>{})
            client.db.set(`levelup_deleteafter_${interaction.guildId}`, time);
            return interaction.followUp({content: `Le message sera supprimé après ${askedTime}.`}).catch(e=>{})
        }
    }
}