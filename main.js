const mineflayer = require('mineflayer')
const {pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin

const bossName = "NotACrazyGuy"
const prefix = 'leebot_'
const closeness = 1

let botnum = 1
let bots = []


const server = {
    address: 'localhost',
    version: '1.18.2',
    port: 31312
}

const createBot = () => {
    let bot = mineflayer.createBot({
        host: server.address,
        port: server.port,
        username: `${prefix}${botnum}`,
        version: server.version
    })
    botnum = botnum + 1
    bot.loadPlugin(pathfinder)
    bot.once('spawn', () =>{
        const mcData = require('minecraft-data')(server.version)
        const defaultMove = new Movements(bot, mcData)

        bot.on('chat', (username, message) => {
            if (username === bot.username) {
                return 0
            }
            if (message !== 'come') {
                return 0
            }
            const target = bot.players[bossName]?.entity
            if (!target) {
                // bot.chat("I don't see you")
                return
            }
            const {x: playerX, y: playerY, z: playerZ} = target.position

            bot.pathfinder.setMovements(defaultMove)
            bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, closeness))
        })

    })

    return bot
}

const populate = () => {
    bots.push(createBot())
    if (botnum <= 7){
        setTimeout(populate, 500)
    }
}

populate()
