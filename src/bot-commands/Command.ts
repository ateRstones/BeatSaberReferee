import { Message } from "discord.js"
import ActivatedCommand from "../models/ActivatedCommand"

export default abstract class Command {

    public abstract readonly name: string
    public abstract readonly description: string
    public abstract execute(activatedCommand: ActivatedCommand): void

}