import { Client } from 'discord.js'
import Logger from './utils/logging'
import c from 'config'
import sleep from './utils/sleep'
import settings from './settings/Settings'
import ModuleManager from './bot-modules/ModuleManager'
import Database from "./models/database/Database"
import LocalizedMessage from "./utils/LocalizedMessage"

export const client = new Client()
const moduleManager = ModuleManager.getInstance()
const logger = Logger.getLogger("beatsaber")
logger.setPrefix("Beatsaber Referee Bot")
const database = new Database()

async function login() {
    logger.info('Trying to log in...')
    const token = c.get<string>('discord.token')
    await client.login(token)
    logger.info(`Logged in!`)
}

async function reconnect() {
    try { await login() }
    catch(e) {
        logger.error("Error connecting", e)
        logger.info("Trying reconnection in 30 seconds")
        await sleep(30000)
        reconnect()
    }
}

async function init() {
    try {
        logger.setLogLevel(c.get<string>("loglevel"))
        await database.init()
        LocalizedMessage.initialize()
        await login()
        moduleManager.setupModules(settings.modules)
    }
    catch(e) {logger.error("Error at init", e)}
}

client.on("error", e => logger.error("Client error", e))
client.on("disconnect", _ => reconnect())
init()