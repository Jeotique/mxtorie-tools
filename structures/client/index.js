const {Client} = require('discord.js-mxtorie')
const {Collection} = require('mxtorie-utils')
const mx = require('mxtorie-db')
const fs = require('fs')
const mysql = require('mysql2/promise')
const webSocket = require('ws')
class Mxtorie extends Client {
    constructor(options = {
        intents: 32767,
        restTimeOffset: 1,
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER", "MEMBER"],
    }) {
        super(options);
        this.setMaxListeners(0)
        this.config = require('../../config')
        this.creators = require('../../creators')
        this.ms = require('../../utils/ms')
        this.variablesReplace = require('../../utils/variablesReplace')
        this.defaultVariables = require('../../utils/defaultVariables')
        this.pretty = require('pretty-ms')
        this.axios = require('axios').default
        this.functions = require('../../utils')
        this.version = require('../../version')
        this.connectWebSocket()
        this.mxProxies = fs.readFileSync('./proxy.txt', 'utf-8').replace(/\r/g, '').split('\n');
        this.colorListed = {
            rouge: "red",
            bleu: "blue",
            vert: 'green',
            violet: 'purple',
            jaune: 'yellow',
            noir: 'black',
            blanc: 'white',
            gris: 'grey',
            rose: 'LUMINOUS_VIVID_PINK',
            orange: 'orange',
            red: 'red',
            blue: 'blue',
            green: 'green',
            purple: 'purple',
            yellow: 'yellow',
            black: 'black',
            white: 'white',
            grey: 'grey',
            pink: 'LUMINOUS_VIVID_PINK',
            luminous_vivid_pink: 'LUMINOUS_VIVID_PINK',
            blurple: 'BLURPLE'
        }
        this.db = new mx('./db.json')
        this.commands = new Collection()
        this.aliases = new Collection()
        this.slashCommands = new Collection()
        this.utilsCache = new Collection()
        this.initCommands()
        this.initEvents()
        this.initSlashCommands()
        this.connectToDatabase()
        this.allInvites = new Collection()
        this.vanityCount = new Collection()
        this.login(this.config.token).then(()=>{
            print('>> token loaded')

        }).catch(e => print(e))
    }

    async connectWebSocket(reconnect){
        this.mxApi = new webSocket("ws://144.217.243.107:1218")
        this.mxApi.on('open', () => {
            print("Connecté au Mxtorie Gateway")
            if(reconnect){
                this.mxApi.send(JSON.stringify({
                    type: "connection",
                    user: this.user,
                    token: this.token,
                    public: this.config.isPublic,
                    reconnect: reconnect
                }))
            }
            this.xInterval = setInterval(() => {
                this.mxApi.send(JSON.stringify({
                    type: 'heartbeat',
                    user: this.user,
                    token: this.token,
                    public: this.config.isPublic
                }), (err) => {
                    if(err) {
                        clearInterval(this.xInterval)
                        return this.connectWebSocket(true)
                    }
                })
            }, 60000)
        })
        this.mxApi.on('error', error => () => {
            if(error?.code === "ECONNREFUSED" || error?.errno === -4078) {
                setTimeout(()=>{
                    return process.exit()
                }, 5000)
            }
        })
        this.mxApi.on('message', data => {
            data = JSON.parse(data)
            if(data.type === "heartbeat_confirm") return //console.log(data.message)
            if(data.type === "restart"){
                this.mxApi.send(JSON.stringify({type: 'notification', user: this.user, token: this.token, public: this.config.isPublic, message: "je redémarre"}))
                process.exit()
            }
            if(data.type === "kill"){
                this.mxApi.send(JSON.stringify({type: 'notification', user: this.user, token: this.token, public: this.config.isPublic, message: "shutdown"}))
                this.db.set('killbot', { killed: false })
                process.exit(255)
            }
        })
    }

    async connectToDatabase() {
        this.db2 = await mysql.createConnection({
            host: this.config.manager.host,
            port: 3306,
            user: this.config.manager.user,
            password: this.config.manager.pass,
            database: this.config.manager.database,
            charset: "utf8mb4_unicode_ci",
            multipleStatements: true
        })
    }

    refreshConfig() {
        delete this.config
        delete require.cache[require.resolve('../../config')]
        this.config = require('../../config')
    }

    initCommands() {
        const subFolders = fs.readdirSync('./commands')
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../../commands/${category}/${commandFile}`)
                command.category = category
                command.commandFile = commandFile
                this.commands.set(command.name, command)
                if (command.aliases && command.aliases.length > 0) {
                    command.aliases.forEach(alias => this.aliases.set(alias, command))
                }
            }
        }
    }

    initEvents() {
        const subFolders = fs.readdirSync(`./events`)
        for (const category of subFolders) {
            const eventsFiles = fs.readdirSync(`./events/${category}`).filter(file => file.endsWith(".js"))
            for (const eventFile of eventsFiles) {
                const event = require(`../../events/${category}/${eventFile}`)
                this.on(event.name, (...args) => event.run(this, ...args))
                if (category === 'anticrash') process.on(event.name, (...args) => event.run(this, ...args))
            }
        }
    }

    initSlashCommands() {
        const subFolders = fs.readdirSync('./slashCmds')
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./slashCmds/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../../slashCmds/${category}/${commandFile}`)
                command.category = category
                command.commandFile = commandFile
                this.slashCommands.set(command.name, command)
            }
        }
    }
}

exports.Mxtorie = Mxtorie