import { Message, Role, GuildMember } from "discord.js"
import ActivatedCommand from "../models/ActivatedCommand"
import Command from "./Command"
import LocalizedMessage from "../utils/LocalizedMessage"
import Logger from "../utils/logging"
import { database } from "../index"
import DuelRequest from "../models/database/entity/DuelRequest"

let logger = Logger.getLogger("beatsaber")

export default class RequestListCommand extends Command {

    public name: string = "requestlist"
    public description: string = "Command for listing duel requests."
    public async execute(activatedCommand: ActivatedCommand): Promise<void> {
        let enteringMember = activatedCommand.message.member
        let enteringUser = await database.getOrCreateUpdatedUser(enteringMember.id, enteringMember.displayName, true)

        let output: string = ""

        if(enteringUser.receivedDuels !== undefined) {
            let recDuel = <DuelRequest[]>enteringUser.receivedDuels

            if(recDuel.length > 0) {
                output = this.addLine(output, LocalizedMessage.getLocalized("commands.requestlist.msg.requestedheader"))

                let count = 0
                recDuel.forEach(dr => {
                    count++
                    output = this.addLine(output, LocalizedMessage.getParsed("commands.requestlist.msg.requestedduel", {"count": count, "player": dr.requestingUser.discordName}))
                })
            } else {
                output = this.addLine(output, LocalizedMessage.getLocalized("commands.requestlist.msg.norequests"))
            }
        } else {
            output = this.addLine(output, LocalizedMessage.getLocalized("commands.requestlist.msg.norequests"))
        }

        output = this.addLine(output, "")

        if(enteringUser.requestedDuels !== undefined) {
            let reqDuel = <DuelRequest[]>enteringUser.requestedDuels

            if(reqDuel.length > 0) {
                output = this.addLine(output, LocalizedMessage.getLocalized("commands.requestlist.msg.requestingheader"))

                let count = 0
                reqDuel.forEach(dr => {
                    count++
                    output = this.addLine(output, LocalizedMessage.getParsed("commands.requestlist.msg.requestingduel", {"player": dr.receivingUser.discordName, "count": count}))
                })
            } else {
                output = this.addLine(output, LocalizedMessage.getLocalized("commands.requestlist.msg.norequesting"))
            }
        } else {
            output = this.addLine(output, LocalizedMessage.getLocalized("commands.requestlist.msg.norequesting"))
        }

        activatedCommand.replyToChannel(output)
    }

    private addLine(input: string, append: string, usenewline: boolean = true): string {
        if(input.length > 0 && usenewline) {
            return input + "\n" + append
        } else {
            return input + append
        }
    }

}