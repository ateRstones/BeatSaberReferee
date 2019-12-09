import { Message, Role, GuildMember } from "discord.js"
import ActivatedCommand from "../models/ActivatedCommand"
import Command from "./Command"
import LocalizedMessage from "../utils/LocalizedMessage"
import Logger from "../utils/logging"
import { database } from "../index"
import DuelRequest from "../models/database/entity/DuelRequest"
import Duel from "../models/database/entity/Duel"
import {DuelState} from "../models/database/entity/Duel"
import User from "../models/database/entity/User"


let logger = Logger.getLogger("beatsaber")

export default class StartCommand extends Command {

    private authorizedIds: string[]

    constructor(authorizedIds: string[]) {
        super()
        this.authorizedIds = authorizedIds
    }
    
    public name: string = "start"
    public description: string = "Command for starting duels. (admin only)"
    public async execute(activatedCommand: ActivatedCommand): Promise<void> {

        if(this.authorizedIds.includes(activatedCommand.message.member.id)) {
            if(activatedCommand.args.length > 1) {
                let player1 = activatedCommand.args[0]
                let player2 = activatedCommand.args[1]
                
                if(player1.startsWith("<@")) {
                    let id = player1.substring(2, player1.length - 1)
                    let member1 = activatedCommand.message.guild.members.find(m => m.id === id)

                    if(member1 !== undefined) {
                        if(player2.startsWith("<@")) {
                            let id = player2.substring(2, player1.length - 1)
                            let member2 = activatedCommand.message.guild.members.find(m => m.id === id)
            
                            if(member2 !== undefined) {
                                let user1 = await database.getOrCreateUpdatedUser(member1.id, member1.displayName)
                                let user2 = await database.getOrCreateUpdatedUser(member2.id, member2.displayName)

                                let duel = await user1.getDuelWith(user2, [DuelState.Created])

                                if(duel !== undefined) {
                                    (<Duel>duel).state = DuelState.Running;
                                    (<Duel>duel).save()
                                    activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.start.msg.startedduel", {"player1": user1.discordName, "player2": user2.discordName}))
                                } else {
                                    activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.start.msg.noduel", {"player1": user1.discordName, "player2": user2.discordName}))
                                }
                            } else {
                                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.start.error.unknownplayer", {"player": player2}))
                            }
                        } else {
                            activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.start.error.invalidinput", {"input": player2}))
                        }
                    } else {
                        activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.start.error.unknownplayer", {"player": player1}))
                    }
                } else {
                    activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.start.error.invalidinput", {"input": player1}))
                }
                
            } else {
                activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.start.error.noargs"))
            }
        } else {
            activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.start.error.nopermission"))
        }
    }
}