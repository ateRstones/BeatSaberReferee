import c from 'config'
import Command from '../bot-commands/Command'
import Module from '../bot-modules/modules/Module'
import CommandManagerModule from '../bot-modules/modules/CommandManagerModule'
import ColorChangeCommand from '../bot-commands/ColorChangeCommand'
import RequestCommand from '../bot-commands/RequestCommand'
import RequestAcceptCommand from '../bot-commands/RequestAcceptCommand'
import RequestListCommand from '../bot-commands/RequestListCommand'
import RequestDeclineCommand from '../bot-commands/RequestDeclineCommand'
import StartCommand from '../bot-commands/StartCommand'
import DeleteCommand from '../bot-commands/DeleteCommand'

class BeatsaberRefereeBotSettings {

    public readonly modules: Module[] = [
        new CommandManagerModule()
    ]

    public readonly commands: Command[] = [
        new ColorChangeCommand(c.get<string[]>("discord.colorRoles")),
        new RequestCommand(),
        new RequestAcceptCommand(),
        new RequestListCommand(),
        new RequestDeclineCommand(),
        new StartCommand(c.get<string[]>("discord.authorizedUsers")),
        new DeleteCommand(c.get<string[]>("discord.authorizedUsers"))
    ]

    public readonly prefix = c.get<string>('discord.prefix')

}

const settings = new BeatsaberRefereeBotSettings()
export default settings