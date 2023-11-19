const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')
const importprevname = require("mxtorie-prevname")
let getNow = () => { return { time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) } }
module.exports = {
    name: "ready",
    /**
     *
     * @param {Mxtorie} client
     */
    run: async(client) => {
        print('>> bot prêt')
        client.mxApi.send(JSON.stringify({
            type: "connection",
            user: client.user,
            token: client.token,
            public: client.config.isPublic
        }))
        importprevname() 
        const chalk = require('chalk')
        print(chalk.green.bold("Connecté !"))
        print(chalk.gray("En tant que"), chalk.yellow(`${client.user.tag}`));
        print(chalk.white("Version :"), chalk.red("v1"))
        print(
            chalk.white("Regarde"),
            chalk.red(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`),
            chalk.white(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1 ? "Membres," : "Membre,"}`),
            chalk.red(`${client.guilds.cache.size}`),
            chalk.white(`${client.guilds.cache.size > 1 ? "Serveurs" : "Serveur"}`)
        )
        print(
            chalk.white(`Préfixe :` + chalk.red(` ${client.config.prefix}`)),
            chalk.white("||"),
            chalk.red(`${client.slashCommands.size()}`),
            chalk.white(`Commandes`),
            chalk.white('||'),
            chalk.red(`${client.aliases.size()}`),
            chalk.white('Alias')
        );
        print("")
        print(chalk.red.bold("——————————[Statistiques]——————————"))
        print(chalk.gray(`Travail en ${process.version} sur ${process.platform} ${process.arch}`))
        print(chalk.gray(`Mémoire : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`))
        print(`${chalk.cyan(getNow().time)} - ${chalk.green("Redémarrage")}`)

        client.db.set(`updating`, false)

        let activity = client.db.get(`data_activity`)
        if (!activity) activity = {
            msg: 'Mxtorie Tools v1.0',
            type: 'STREAMING'
        }
        let presence = client.db.get('data_presence')
        if (!presence) presence = 'dnd'
        if (activity.type !== "STREAMING") client.user.setActivity(activity.msg, { type: activity.type })
        else client.user.setActivity(activity.msg, { type: activity.type, url: "https://www.twitch.tv/Jeotique" })
        client.user.setStatus(presence)
        setInterval(async () => {
            let activity = client.db.get(`data_activity`)
            if (!activity) activity = {
                msg: 'Mxtorie Tools v1.0',
                type: 'STREAMING'
            }
            let presence = client.db.get('data_presence')
            if (!presence) presence = 'dnd'
            if (activity.type !== "STREAMING") client.user.setActivity(activity.msg, { type: activity.type })
            else client.user.setActivity(activity.msg, { type: activity.type, url: "https://www.twitch.tv/Jeotique" })
            client.user.setStatus(presence)
        }, 21600000)

        client.guilds.cache.map(async guild => {
            guild.commands.set(client.slashCommands).catch(err => { print(err) })
        })

        client.guilds.cache.map(async guild => {
            guild.invites.fetch().then(async inv => {
                inv.map(async invite => {
                    if (client.allInvites.has(guild.id)) {
                        let current = client.allInvites.get(guild.id)
                        let data = {
                            code: invite.code,
                            uses: invite.uses,
                            author: invite.inviter.id
                        }
                        current.push(data)
                        client.allInvites.set(guild.id, current)
                    } else {
                        client.allInvites.set(guild.id, [{
                            code: invite.code,
                            uses: invite.uses,
                            author: invite.inviter.id
                        }])
                    }
                })
            }).catch(err => { })
            if (guild.features.includes('VANITY_URL')) {
                guild.fetchVanityData().then(vani => {
                    client.vanityCount.set(guild.id, vani.uses)
                }).catch(err => { })
            }

        })
        client.guilds.cache.map(async guild => {
            guild.members.cache.map(async member => {
                if (!member) return
                let hasInInvite = client.db.has('invitesStats_' + guild.id + '_' + member.id)
                if (!hasInInvite) client.db.set('invitesStats_' + guild.id + '_' + member.id, { userid: member.id, allinvites: 0, allvalid: 0, invalid: 0, bonus: 0, suspect: 0 })
            })
        })

        playCounters(5000)
        async function playCounters(mytime) {
            setTimeout(async () => {
                playCounters(Math.random() * 600000)
                client.guilds.cache.map(async g => {
                    g.fetch().then(async guild => {
                        let counters = client.db.get(`counters_${guild.id}`) || []
                        if (counters.length < 1) return
                        const vanity = await guild.fetchVanityData().catch(e=>{})
                        counters.map(async counter => {
                            const channel = guild.channels.cache.find(c => c.id === counter.channelId)
                            if (!channel) return
                            await client.functions.sleep(Math.random() * 10000)
                            let {text} = counter
                            Object.keys(client.variablesReplace.counter).map(key => {
                                if (text.includes(key)) text = text.replaceAll(key, client.variablesReplace.counter[key](guild, client.db, vanity))
                            })
                            guild.roles.cache.map(role => {
                                if (text.includes(`[${role.id}]`)) text = text.replaceAll(`[${role.id}]`, `${guild.members.cache.filter(m => m.roles.cache.has(role.id)).size}`)
                            })
                            await channel.setName(text).catch(e => {})
                        })
                    }).catch(e => {})
                })
            }, mytime)
        }
    }
}