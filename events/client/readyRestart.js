module.exports = {
    name: 'ready',

    run: async(client)=>{
        lookForKill()
        let channel = await client.db.get(`restartchan`)
        if(!channel) return
        await client.db.set(`restartchan`, false)
        channel = client.channels.cache.get(channel)
        if(!channel) return
        channel.send(`Bot en ligne.`)

        async function lookForKill(){
            let data = client.db.get('killbot')
            if(!data) return
            if(!data.killed){
                console.log('kill bot ordonné')
                client.db.delete('killbot')
                return process.exit(255)
            }else return client.db.delete('killbot')
        }
    }
}