import { Message, Role, GuildMember } from "discord.js"
import ActivatedCommand from "../models/ActivatedCommand"
import Command from "./Command"
import LocalizedMessage from "../utils/LocalizedMessage"
import Logger from "../utils/logging"
import { database } from "../index"
import DuelRequest from "../models/database/entity/DuelRequest"
import Duel from "../models/database/entity/Duel"

let logger = Logger.getLogger("beatsaber")

export default class RequestAcceptCommand extends Command {

    public name: string = "accept"
    public description: string = "Command for accepting duels."
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
                let acceptingMember = activatedCommand.message.member
                if(challengingMember.id !== acceptingMember.id) {
                    let challengingUser = await database.getOrCreateUpdatedUser(challengingMember.id, challengingMember.displayName)
                    let acceptingUser = await database.getOrCreateUpdatedUser(acceptingMember.id, acceptingMember.displayName)

                    if(!await acceptingUser.hasDuelWith(challengingUser)) {
                        if(!await acceptingUser.hasRequested(challengingUser)) {
                            if(await acceptingUser.gotRequestedBy(challengingUser)) {
                                let acceptedDuel = new Duel()
                                acceptedDuel.participants = [challengingUser, acceptingUser]
                                acceptedDuel.save()
                                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.accept.msg.success", {"player": input}))
                                let request = await DuelRequest.findOne({"requestingUser": challengingUser, "receivingUser": acceptingUser})
                                if(request !== undefined) {
                                    DuelRequest.remove(<DuelRequest>request)
                                }
                            } else {
                                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.accept.msg.norequest", {"player": input}))
                            }
                        } else {
                            activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.accept.msg.requested", {"player": input}))
                        }
                    } else {
                        activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.accept.msg.alreadyhasduel", {"player": input}))
                    }
                } else {
                    activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.accept.error.selfduel"))
                }
                
            } else {
                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.accept.error.unknownplayer", {"player": input}))                
            }
            
        } else {
            activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.accept.error.noargs"))
        }
    }


}