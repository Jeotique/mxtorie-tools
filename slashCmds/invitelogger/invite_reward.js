const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'invite_reward',
    description: "Gérer des rôles qui seront donnés aux membres ayant atteint un certain nombre d'invitations",
    type: "CHAT_INPUT",
    options: [{
        name: 'action',
        description: "Quel action voulez-vous effectuer ?",
        type: 'STRING',
        required: true,
        choices: [{
            name: "Voir la liste",
            value: "list"
        }, {
            name: "Ajouter un rôle",
            value: "add"
        }, {
            name: "Retirer un rôle",
            value: "remove"
        }]
    }, {
        name: 'role',
        description: "Quel rôle voulez-vous ajouter/retirer ?",
        type: "ROLE",
        required: false
    }, {
        name: 'nombre',
        description: "A combien d'invitations voulez-vous ajouter/retirer ce rôle ?",
        type: "NUMBER",
        required: false
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
        let action = interaction.options.getString("action")
        let role = interaction.options.getRole("role")
        let nombre = interaction.options.getNumber("nombre")
        switch(action){
            case 'list':
                const every = client.db.all().filter(v => v.key.startsWith(`recomp_${interaction.guildId}`))
                if (every.length < 1) return interaction.followUp({content:'Ce serveur n\'a aucune récompense.'}).catch(e=>{})
                const toSplice = `recomp_${interaction.guildId}_`
                const embed = new Discord.MessageEmbed()
                embed.setTitle('Récompense(s) invitations')
                embed.setDescription(every.map(v => { if (interaction.guild.roles.cache.has(v.data)) return `${v.key.slice(toSplice.length)} : <@&${v.data}>` }).join('\n').toString())
                embed.setColor(client.config.color)
                return interaction.followUp({ embeds: [embed] }).catch(e=>{{}})
                break;
            case 'add':
                if(!role) return interaction.followUp({content: "Vous ne m'avez donné aucun rôle."}).catch(e=>{})
                if(!nombre) return interaction.followUp({content: "Vous ne m'avez donné aucun nombre."}).catch(e=>{})
                if(nombre < 1) return interaction.followUp({content: "Le nombre d'invitations requis ne peut pas être inférieur à 1."}).catch(e=>{})
                if(client.db.has(`recomp_${interaction.guildId}_${nombre}`)) return interaction.followUp({content: "Un rôle est déjà donné à ce nombre d'invitations."}).catch(e=>{})
                client.db.set(`recomp_${interaction.guildId}_${nombre}`, role.id)
                return interaction.followUp({content: `Le rôle \`${role.name}\` sera maintenant donné après ${nombre} invitations.`}).catch(e=>{})
                break;
            case 'remove':
                if(!nombre) return interaction.followUp({content: "Vous ne m'avez donné aucun nombre."}).catch(e=>{})
                if(nombre < 1) return interaction.followUp({content: "Le nombre d'invitations ne peut pas être inférieur à 1."}).catch(e=>{})
                if(!client.db.has(`recomp_${interaction.guildId}_${nombre}`)) return interaction.followUp({content: `Il n'y a déjà aucune récompense à ${nombre} invitations.`}).catch(e=>{})
                client.db.delete(`recomp_${interaction.guildId}_${nombre}`)
                return interaction.followUp({content: `Récompense ${nombre} invitations supprimée.`}).catch(e=>{})
                break;
        }
    }
}