const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const fs = require("fs")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'bot_update',
    description: "Télécharge et installe les nouvelles mise à jour",
    type: "CHAT_INPUT",
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

        if (client.db.get(`updating`)) return
        const Downloader = require('nodejs-file-downloader');
        client.db.set(`updating`, true)
        client.axios.get(`https://apolobite.000webhostapp.com/important5/version.txt`).then(async (result) => {
            if (result.data === client.version) {
                client.db.set(`updating`, false)
                interaction.followUp("Le bot est déjà à jour.").catch(e => { })
            } else {
                const downloader = new Downloader({
                    url: 'https://apolobite.000webhostapp.com/important5/update.zip',
                    directory: "./downloads",
                })
                try {
                    interaction.followUp("Téléchargement des mises à jour....").catch(e => { })
                    await downloader.download();

                    console.log('Téléchargement terminé');
                    await client.functions.sleep(500)
                    interaction.followUp("Installation en cours...").catch(e => { })
                    const extract = require('../../structures/extractsystem')
                    await extract('./downloads/update.zip', { dir: './' })
                    console.log('Extraction terminé')
                    await fs.unlinkSync('./downloads/update.zip')
                    await client.db.set(`restartchan`, interaction.channelIdn)
                    interaction.followUp('Redémarrage...').then(async m => {
                        await client.db.set(`updating`, false);
                        return process.exit()
                    }).catch(e => { })
                } catch (error) {
                    console.log('Download failed', error)
                    interaction.followUp(`**Une erreur est survenue ! Contactez Jeotique#0001**`)
                    await client.db.set(`updating`, false)
                    return fs.unlinkSync('./downloads/update.zip')
                }
            }
        })
    }
}