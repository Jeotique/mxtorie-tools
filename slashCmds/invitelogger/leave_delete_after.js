const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leave_delete_after',
    description: "Définie après combien de temps le message d'au revoir ce supprime.",
    type: "CHAT_INPUT",
    options: [{
        name: 'type',
        description: 'A quel action servira ce message ?',
        type: 'STRING',
        required: true,
        choices: [{
            name: 'Invité connu',
            description: 'Lorsque le membre qui a invité est connu',
            value: 'know_invite'
        }, {
            name: 'Invité par url perso',
            description: 'Lorsque le membre a rejoint avec l\'url personnalisée',
            value: 'vanity'
        }, {
            name: 'Invité inconnu',
            description: 'Lorsque le membre qui a invité est inconnu',
            value: 'unknow'
        }, {
            name: 'Invité sois même',
            description: 'Le membre a rejoint avec son propre lien',
            value: 'himself'
        }]
    },
        {
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
        let type = interaction.options.getString("type")
        let askedTime = interaction.options.getString("temps")
        if(askedTime.toLowerCase()==="off"){
            switch(type){
                case 'know_invite': client.db.delete(`leave_deleteafter_${interaction.guildId}`); break;
                case 'vanity': client.db.delete(`leavevanity_deleteafter_${interaction.guildId}`); break;
                case 'unknow': client.db.delete(`leaveunknow_deleteafter_${interaction.guildId}`); break;
                case 'himself': client.db.delete(`leavehimself_deleteafter_${interaction.guildId}`); break;
            }
            return interaction.followUp({content: "Le message restera dans le chat."}).catch(e=>{})
        } else {
            let time = client.ms(askedTime)
            if(!time) return interaction.followUp({content: "Le temps est invalide."}).catch(e=>{})
            if(time <= 0) return interaction.followUp({content: "Le temps ne peut pas être inférieur ou égal à 0 ms."}).catch(e=>{})
            if(time > 1296000000) return interaction.followUp({content: "Le temps ne peut pas être plus grand que 15 jours."}).catch(e=>{})
            switch(type){
                case 'know_invite': client.db.set(`leave_deleteafter_${interaction.guildId}`, time); break;
                case 'vanity': client.db.set(`leavevanity_deleteafter_${interaction.guildId}`, time); break;
                case 'unknow': client.db.set(`leaveunknow_deleteafter_${interaction.guildId}`, time); break;
                case 'himself': client.db.set(`leavehimself_deleteafter_${interaction.guildId}`, time); break;
            }
            return interaction.followUp({content: `Le message sera supprimé après ${askedTime}.`}).catch(e=>{})
        }
    }
}