import { Client } from 'discord.js'
import Logger from './utils/logging'
import c from 'config'
import sleep from './utils/sleep'
import settings from './settings/Settings'
import ModuleManager from './bot-modules/ModuleManager'
import Database from "./models/database/Database"
import LocalizedMessage from "./utils/LocalizedMessage"
import Duel from "./models/database/entity/Duel"
import DuelRequest from './models/database/entity/DuelRequest'

export const client = new Client()
const moduleManager = ModuleManager.getInstance()
const logger = Logger.getLogger("beatsaber")
logger.setPrefix("Beatsaber Referee Bot")
export const database = new Database()

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

// ! TEMP Test
async function test() {
    try {
        logger.setLogLevel(c.get<string>("loglevel"))
        await database.init()
        LocalizedMessage.initialize()
        //await login()
        //moduleManager.setupModules(settings.modules)
        let receivingUser = await database.getOrCreateUpdatedUser("232610274077704192", "Tom | ateRstones")
        let requestingUser = await database.getOrCreateUpdatedUser("651958530244476928", "ateRstones2")
        //let duelCreate = new Duel()
        //duelCreate.participants = [receivingUser, requestingUser]
        //await duelCreate.save()
        let request = new DuelRequest(receivingUser, requestingUser)
        await request.save()
        let duel = await requestingUser.hasDuelWith(receivingUser)
        let requested = await requestingUser.hasRequested(receivingUser)
        let gotRequested = await requestingUser.gotRequestedBy(receivingUser)
        logger.info(`duel = ${duel} requested = ${requested} gotRequested = ${gotRequested}`)
    }
    catch(e) {logger.error("Error at init", e)}
}

client.on("error", e => logger.error("Client error", e))
client.on("disconnect", _ => reconnect())
init()
//test()