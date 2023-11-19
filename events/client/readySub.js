const Discord = require('discord.js-mxtorie')
const { Mxtorie } = require('../../structures/client')
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: 'ready',

    /**
     *
     * @param {Mxtorie} client
     */
    run: async (client) => {
        try {
            let [result] = await client.db2.execute(`SELECT * FROM buyer WHERE userid = '${client.config.buyers[0]}' AND botid = '${client.user.id}'`)
            if (!result[0]) return [console.log('Bot non enregistré '+client.user.tag+' | '+client.user.id), process.exit(255)]
            let ended = result[0].end
            if ((ended - Date.now()) > 0) return setInterval(async () => {
                let [result] = await client.db2.execute(`SELECT * FROM buyer WHERE userid = '${client.config.buyers[0]}' AND botid = '${client.user.id}'`)
                if (!result[0]) return [console.log('Bot non enregistré '+client.user.tag+' | '+client.user.id), process.exit(255)]
                if ((ended - Date.now()) < 0 || (ended - Date.now()) == 0) return [console.log('Temps écoulé. '+client.user.tag+' | '+client.user.id), process.exit(255)]
            }, 3600000)
            else return [console.log('Temps terminé. '+client.user.tag+' | '+client.user.id), process.exit(255)]
        } catch (err) {
            console.log("readyCheckSubs error : " + err)
        }
    }
}