import { Message } from "discord.js";
import ActivatedCommand from "../models/ActivatedCommand";

/**
 * Checks and converts the message into an instance of the ActivatedCommand class.
 */
export default function convertMsgToActivatedCommand(msg: Message, prefix: string): ActivatedCommand | undefined {
    // Check if the message starts with the specified prefix.
    if (!msg.content.startsWith(prefix))
        return

    const args: string[] = msg.content.substring(prefix.length).split(' ')
    // Check if only the prefix was typed (no command specified)
    if (!args.length)
        return
    
    const name: string = <string>args.shift()
    return new ActivatedCommand(name.toLowerCase(), args, msg)
}