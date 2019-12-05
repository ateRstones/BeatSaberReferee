import c from 'config'
import Command from '../bot-commands/Command'
import Module from '../bot-modules/modules/Module'
import CommandManagerModule from '../bot-modules/modules/CommandManagerModule'
import ColorChangeCommand from '../bot-commands/ColorChangeCommand'

class BeatsaberRefereeBotSettings {

    public readonly modules: Module[] = [
        new CommandManagerModule()
    ]

    public readonly commands: Command[] = [
        new ColorChangeCommand(c.get<string[]>("discord.colorRoles"))
    ]

    public readonly prefix = c.get<string>('discord.prefix')

}

const settings = new BeatsaberRefereeBotSettings()
export default settings