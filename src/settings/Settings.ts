import c from 'config'
import Command from '../bot-commands/Command'
import Module from '../bot-modules/modules/Module'
import CommandManagerModule from '../bot-modules/modules/CommandManagerModule'

class BeatsaberRefereeBotSettings {

    public readonly modules: Module[] = [
        new CommandManagerModule()
    ]

    public readonly commands: Command[] = [
        // No commands to date
    ]

    public readonly prefix = c.get<string>('discord.prefix')

}

const settings = new BeatsaberRefereeBotSettings()
export default settings