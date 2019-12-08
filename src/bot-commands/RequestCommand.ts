import { Message, Role, GuildMember } from "discord.js"
import ActivatedCommand from "../models/ActivatedCommand"
import Command from "./Command"
import LocalizedMessage from "../utils/LocalizedMessage"
import Logger from "../utils/logging"
import { database } from "../index"
import DuelRequest from "../models/database/entity/DuelRequest"

let logger = Logger.getLogger("beatsaber")

export default class RequestCommand extends Command {

    public name: string = "request"
    public description: string = "Command for requesting duels."
    public async execute(activatedCommand: ActivatedCommand): Promise<void> {

        if(activatedCommand.args.length > 0) {
            let input = activatedCommand.args.join(" ")
            
            let requestedMember: GuildMember;
            if(input.startsWith("<@")) {
                let id = input.substring(2, input.length - 1)
                requestedMember = activatedCommand.message.guild.members.find(m => m.id === id)
            } else {
                requestedMember = activatedCommand.message.guild.members.find(m => m.displayName === input)
            }

            if(requestedMember !== undefined) {
                let requestingMember = activatedCommand.message.member
                if(requestedMember.id !== requestingMember.id) {
                    let receivingUser = await database.getOrCreateUpdatedUser(requestedMember.id, requestedMember.displayName)
                    let requestingUser = await database.getOrCreateUpdatedUser(requestingMember.id, requestingMember.displayName)

                    if(!await requestingUser.hasDuelWith(receivingUser)) {
                        if(!await requestingUser.hasRequested(receivingUser)) {
                            if(!await requestingUser.gotRequestedBy(receivingUser)) {
                                let duelrequest = new DuelRequest(requestingUser, receivingUser)
                                duelrequest.save()
                                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.request.msg.success", {"player": input}))
                            } else {
                                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.request.msg.alreadygotrequested", {"player": input}))
                            }
                        } else {
                            activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.request.msg.alreadyrequested", {"player": input}))
                        }
                    } else {
                        activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.request.msg.alreadyhasduel", {"player": input}))
                    }
                } else {
                    activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.request.error.selfrequest"))
                }
                
            } else {
                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.request.error.unknownplayer", {"player": input}))                
            }
            
        } else {
            activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.request.error.noargs"))
        }
    }


}