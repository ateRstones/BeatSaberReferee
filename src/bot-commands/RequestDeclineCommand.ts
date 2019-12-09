import { Message, Role, GuildMember } from "discord.js"
import ActivatedCommand from "../models/ActivatedCommand"
import Command from "./Command"
import LocalizedMessage from "../utils/LocalizedMessage"
import Logger from "../utils/logging"
import { database } from "../index"
import DuelRequest from "../models/database/entity/DuelRequest"
import Duel from "../models/database/entity/Duel"

let logger = Logger.getLogger("beatsaber")

export default class RequestDeclineCommand extends Command {

    public name: string = "decline"
    public description: string = "Command for declining duels."
    public async execute(activatedCommand: ActivatedCommand): Promise<void> {

        if(activatedCommand.args.length > 0) {
            let input = activatedCommand.args.join(" ")
            
            let challengingMember: GuildMember;
            if(input.startsWith("<@")) {
                let id = input.substring(2, input.length - 1)
                challengingMember = activatedCommand.message.guild.members.find(m => m.id === id)
            } else {
                challengingMember = activatedCommand.message.guild.members.find(m => m.displayName === input)
            }

            if(challengingMember !== undefined) {
                let decliningMember = activatedCommand.message.member
                if(challengingMember.id !== decliningMember.id) {
                    let challengingUser = await database.getOrCreateUpdatedUser(challengingMember.id, challengingMember.displayName)
                    let decliningUser = await database.getOrCreateUpdatedUser(decliningMember.id, decliningMember.displayName)

                    if(await decliningUser.gotRequestedBy(challengingUser)) {
                        activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.decline.msg.success", {"player": input}))
                        let request = await DuelRequest.findOne({"requestingUser": challengingUser, "receivingUser": decliningUser})
                        if(request !== undefined) {
                            DuelRequest.remove(<DuelRequest>request)
                        }
                    } else {
                        activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.decline.msg.norequest", {"player": input}))
                    }
                } else {
                    activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.decline.error.selfduel"))
                }
                
            } else {
                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.decline.error.unknownplayer", {"player": input}))                
            }
            
        } else {
            activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.decline.error.noargs"))
        }
    }


}