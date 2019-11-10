import Module from "./Module";
import Command from "../../bot-commands/Command";
import { Logger } from "ts-logger";
import { client } from "../..";
import { Message } from "discord.js";
import settings from "../../settings/Settings";
import convertMsgToActivatedCommand from "../../utils/convert-msg-to-activated-command";

export default class CommandManagerModule extends Module {

    private static commands: { [name: string]: Command } = {}
    private static logger: Logger = new Logger('Command Manager', { useGlobalLogInformationFactories: true })

    public static getCommands(): { [name: string]: Command } {
        return this.commands
    }

    private _prefix: string = ''

    public setup(): void {
        this._prefix = settings.prefix
        settings.commands.forEach(command => this.register(command))
        this.observeMessages()
    }

    /**
     * Starts listening for new messages.
     */
    private observeMessages(): void {
        client.on('message', (msg) => { this.handleMessage(msg) })
    }

    /**
     * Handles the message by checking if the message activates any command,
     * and then executing the command (if activated).
     */
    private handleMessage(message: Message): void {
        const activatedCommand = convertMsgToActivatedCommand(message, this._prefix)
        if (!activatedCommand)
            return

        const command: Command = CommandManagerModule.commands[activatedCommand.name]

        if (!command)
            return
        
        CommandManagerModule.logger.logInfo(`Command '${command.name}' activated.`)
        command.execute(activatedCommand)
    }

    /**
     * Registers the specified command.
     * It is accessable via the static property `commands` of this class.
     */
    private register(command: Command): void {
        CommandManagerModule.commands[command.name] = command
        CommandManagerModule.logger.logInfo(`Command '${command.name}' registered.`)
    }

}