const mineflayer = require('mineflayer')
const {pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin
const autoEat = require('mineflayer-auto-eat')
const armorManager = require('mineflayer-armor-manager')
const projectile = require(`mineflayer-projectile`)
const toolPlugin = require('mineflayer-tool').plugin


const bossName = "NotACrazyGuy"
const prefix = 'leebot_'
const closeness = 1

let botnum = 1
let bots = []


const server = {
    address: 'localhost',
    version: '1.18.2',
    port: 1522
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
    bot.loadPlugin(autoEat)


    // These four commands are used for auto-eating.
    bot.once("spawn", () => {
        bot.autoEat.options = {
            priority: 'foodPoints',
            startAt: 16,
            eatingTimeout: 3,
            bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh", "poisonous_potato", "spider_eye", "dried_kelp"]
        }
    })

    bot.on("autoeat_started", () => {
        console.log("Auto Eat started!")
    })

    bot.on("autoeat_stopped", () => {
        console.log("Auto Eat stopped!")
    })

    bot.on("health", () => {
        if (bot.food === 20) {
            bot.autoEat.disable()
        }
        else {
            bot.autoEat.enable()
        }
    })

    bot.on('login', () =>{
        let botSocket = bot._client.socket
        console.log(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`)
    })

    bot.on('end', () => {
        console.log(bot.username + " disconnected")
        setTimeout(createBot(), 5000)
    })

    bot.on('error', (err) => {
        console.log(bot.username + ` ${err}`)
    })


    return bot
}

const populate = () => {
    bots.push(createBot())
    if (botnum <= 1){
        setTimeout(populate, 500)
    }
}

populate()
