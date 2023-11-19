const moment = require('moment')
const { Mxtorie } = require('../structures/client')
module.exports = {
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),


    dateToEpoch(date) {
        return parseInt(date.getTime() / 1000)
    },

    Number(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    convertTime(time) {
        let m = moment.duration(time, 'milliseconds')
        let result = `${m.hours() === 0 ? '' : `${m.hours()} ${m.hours() === 1 ? "heure" : "heures"} `}${m.minutes() === 0 ? '' : `${m.minutes()} ${m.minutes() === 1 ? "minute" : "minutes"} `}${m.seconds() === 0 ? "" : `${m.seconds()} ${m.seconds() === 1 ? 'seconde' : 'secondes'}`}`
        return result
    },

    randomChar(Length) {
        let length
        if (!Length || length == 0) length = 15
        else length = Length
        let res = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let value = ""
        for (let i = 0, n = res.length; i < length; ++i) {
            value += res.charAt(Math.floor(Math.random() * n))
        }
        return value
    },

    async getImageAnime(action, axios) {
        const userAgents = require('./user-agents.json')
        if (!action) throw "action is not given in getAnimeImgURL()"

        let array = ["pat", "hug", "waifu", "cry", "kiss", "slap", "smug", "punch"];

        if (!array.find(x => x === action.toLowerCase())) {
            throw "Unknown Action name, options of action are - " + array.join(", ")
        }

        let json = await axios("https://neko-love.xyz/api/v1/" + action.toLowerCase(), {
            headers: {
                "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)]
            }
        });

        json = json.data;
        if (json.code !== 200) throw "Error 01: Unable to access the json content of API"

        return json.url
    },

    isDiscordLink(string) {
        const discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        return discordInvite.test(string)
    },

    isLink(string) {
        const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
        return reg.test(string)
    },
    emoji(client, name, option) {
        let emojis = client.emojis.cache.find(x => x.name === name);
        if (!emojis) return `:${name}:`;
        if (option === "id") {
            return emojis.id;
        }
        if (option === "name") {
            return emojis.name;
        }
        if (emojis) {
            return name
                .split(new RegExp(name, "g"))
                .join(emojis.toString())
                .split(" ")
                .join("_");
        }
    },
    getJoinPosition(user, guild) {
        if (!guild.members.cache.has(user.id)) return 'Inconnu';

        let arr = [];
        guild.members.cache.forEach(member => {
            arr.push(member)
        })

        arr.sort((a, b) => a.joinedAt - b.joinedAt);

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == user.id) return i + 1;
        }
    },
    async getUser(client, userid) {
        let userInfos
        userInfos = await client.axios.get('https://discord.com/api/users/' + userid, {
            headers: {
                Authorization: `Bot ${client.config.token}`,
            }
        }).catch(e => userInfos = null)
        if (userInfos) userInfos = userInfos.data
        return userInfos
    },
    /**
     *
     * @param {Mxtorie} client
     * @returns
     */
    async getOwners(client, guildId) {
        return new Promise(async (resolve) => {
            if (!client.config.isPublic) {
                let data = await client.axios.get(`http://144.217.243.107:1221/api/owners/${client.user.id}`, {
                    headers: { authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310" }
                })
                //console.log(data?.data)
                return resolve(data?.data)
            } else {
                let data = await client.axios.get(`http://144.217.243.107:1221/api/public/owners`, {
                    headers: {
                        authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310"
                    },
                    data: {
                        botId: client.user.id,
                        guildId: guildId
                    }
                })
                //  console.log(data?.data)
                return resolve(data?.data)
            }
        })
    },
    /**
     *
     * @param {Mxtorie} client
     * @param {string} userId
     * @param {string} guildId
     * @returns
     */
    async addOwner(client, userId, guildId){
        return new Promise(async(resolve) => {
            if(!client.config.isPublic){
                let data = await client.axios.post(`http://144.217.243.107:1221/api/owners/${client.user.id}/${userId}`, {}, {
                    headers: {authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310"}
                })
                return resolve(data?.data)
            } else {
                let data = await client.axios.post(`http://144.217.243.107:1221/api/public/owners`, {
                    botId: client.user.id,
                    userId: userId,
                    guildId: guildId
                }, {
                    headers: {authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310"}
                })
                return resolve(data?.data)
            }
        })
    },
    /**
     *
     * @param {Mxtorie} client
     * @param {string} guildId
     * @returns
     */
    async clearOwners(client, guildId){
        return new Promise(async(resolve) => {
            if(!client.config.isPublic){
                let data = await client.axios.delete(`http://144.217.243.107:1221/api/owners/${client.user.id}`, {
                    headers: {authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310"}
                })
                return resolve(data?.data)
            } else {
                let data = await client.axios.delete(`http://144.217.243.107:1221/api/public/owners/${guildId}`, {
                    headers: {authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310"}
                })
                return resolve(data?.data)
            }
        })
    },
    /**
     *
     * @param {Mxtorie} client
     * @param {string} userId
     * @param {string} guildId
     * @returns
     */
    async removeOwner(client, userId, guildId){
        return new Promise(async(resolve) => {
            if(!client.config.isPublic){
                let data = await client.axios.delete(`http://144.217.243.107:1221/api/owners/${client.user.id}/${userId}`, {
                    headers: {authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310"}
                })
                return resolve(data?.data)
            } else {
                let data = await client.axios.delete(`http://144.217.243.107:1221/api/public/owners/${guildId}/${userId}`, {
                    headers: {authorization: "dhjdhfdggf48548547fd6gj4fjddf5454310"}
                })
                return resolve(data?.data)
            }
        })
    },
    json2array(json) {
        var obj = json ? JSON.parse(json) : {}
        return obj
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}