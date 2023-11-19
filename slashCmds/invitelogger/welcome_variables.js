const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'welcome_variables',
    description: "Affiche les variables disponible pour les différentes actions de l'invitelogger.",
    type: "CHAT_INPUT",
    options: [{
        name: 'type',
        description: 'De quel action souhaitez-vous voir les variables ?',
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
        let isEmbed = interaction.options.getBoolean("embed")
        let variablesObject;
        switch(type){
            case 'know_invite': variablesObject = client.variablesReplace.joinNormal; break;
            case 'vanity': variablesObject = client.variablesReplace.joinVanity; break;
            case 'unknow': variablesObject = client.variablesReplace.joinUnknow; break;
            case 'himself': variablesObject = client.variablesReplace.joinUnknow; break;
        }
        let invites = await interaction.guild.invites.fetch().catch(e=>{})
        let invite = invites?.first()
        let inviterInfo = client.db.get('invitesStats_' + interaction.guildId + '_' + invite.inviterId)
        invite.data = inviterInfo
        let vanity = await interaction.guild.fetchVanityData().catch(e=>{})
        let member = interaction.guild.members.cache.random()
        let arguments = {
            'know_invite': [member, interaction.guild, invite, invite.inviter, client.db],
            'vanity': [member, interaction.guild, vanity, client.db],
            'unknow': [member, interaction.guild, client.db],
            'himself': [member, interaction.guild, client.db]
        }
        const embed = new Discord.MessageEmbed()
        Object.keys(variablesObject).map(key => {
            embed.addField(`**${key}**`, `${variablesObject[key](...arguments[type]).includes('@') || variablesObject[key](...arguments[type]).includes('<') ? `${variablesObject[key](...arguments[type])}` : `\`${variablesObject[key](...arguments[type])}\``}`, true)
        })
        embed.setColor(client.config.color)
        embed.setFooter(client.config.footer)
        return interaction.followUp({embeds: [embed]})
    }
}