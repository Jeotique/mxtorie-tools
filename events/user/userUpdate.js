const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const mxtorie = require('mxtorie-prevname')
module.exports = {
    name: 'userUpdate',

    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.User} oldU
     * @param {Discord.User} newU
     * @returns
     */
    run: async (client, oldU, newU) => {
        try {
            if (!oldU) return
            if (!newU) return
            if(newU.bot) return
            if (oldU.tag === newU.tag) return
            let oldUsername = oldU.tag
            let newUsername = newU.tag
            var val = [[newU.id, oldUsername, newUsername, `${Date.now()}`]]
            let [res, fields, error] = await client.db2.query("INSERT INTO prevname (userid, old, new, date) VALUES ?", [val])
        } catch (err) {
            console.log('userUpdate error : ' + err)
        }
    }
}