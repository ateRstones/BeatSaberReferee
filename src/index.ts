import { Client } from 'discord.js'
import { Logger } from 'ts-logger'
import c from 'config'
import sleep from './utils/sleep'
import LogBotTagInformationFactory from './utils/LogBotTagInformationFactory'
import settings from './settings/Settings'
import ModuleManager from './bot-modules/ModuleManager'

export const client = new Client()
const moduleManager = ModuleManager.getInstance()
const logFactory = new LogBotTagInformationFactory(client)
const logger: Logger = new Logger("Beatsaber Referee Bot", { useColor: true, useGlobalLogInformationFactories: true })
Logger.addGlobalLogInformationFactory(logFactory)

async function login() {
    logger.logInfo('Trying to log in...')
    const token = c.get<string>('discord.token')
    await client.login(token)
    logger.logSuccess(`Logged in!`)
}

async function reconnect() {
    try { await login() }
    catch(e) {
        logger.logError(e)
        logger.logInfo("Trying reconnection in 30 seconds")
        await sleep(30000)
        reconnect()
    }
}

async function init() {
    try {
        await login()
        moduleManager.setupModules(settings.modules)
    }
    catch(e) {logger.logError(e)}
}

client.on("error", e => logger.logError(e))
client.on("disconnect", _ => reconnect())
init()