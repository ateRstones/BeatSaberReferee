import { Message, Role } from "discord.js"
import ActivatedCommand from "../models/ActivatedCommand"
import Command from "./Command"
import LocalizedMessage from "../utils/LocalizedMessage"
import Logger from "../utils/logging"

let logger = Logger.getLogger("beatsaber")

export default class ColorChangeCommand extends Command {

    private roles: string[]

    constructor(roles: string[]) {
        super()
        this.roles = roles
    }

    public name: string = "color"
    public description: string = "Command for changing the user color. Use argument \"list\" for color list."
    public execute(activatedCommand: ActivatedCommand): void {

        if(activatedCommand.args.length > 0) {
            let input = activatedCommand.args.join(" ")
        
            if(input === "list") {
                activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.color.msg.listcolors", {"colors": this.roles}))
            } else if(input === "rem") {
                activatedCommand.message.member.roles.forEach((val, key, map) => {
                    if(this.roles.includes(val.name)) {
                        activatedCommand.message.member.removeRole(val)
                    }
                })
                activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.color.msg.removed"))
            } else {
                if(this.roles.includes(input)) {
                    let role = activatedCommand.message.guild.roles.find(r => r.name === input)
                    if(role !== undefined) {
                        let sameRole: boolean = false

                        activatedCommand.message.member.roles.forEach((val, key, map) => {
                            if(this.roles.includes(val.name)) {
                                if(val.name !== input) {
                                    activatedCommand.message.member.removeRole(val)
                                } else {
                                    sameRole = true
                                }
                            }
                        })

                        if(!sameRole) {
                            activatedCommand.message.member.addRole(<Role>role)
                            activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.color.msg.success", {"color": input}))
                        } else {
                            activatedCommand.replyToChannel(LocalizedMessage.getParsed("commands.color.msg.alreadyhas", {"color": input}))
                        }
                    } else {
                        logger.warning(`Could not get role ${input}`)
                        activatedCommand.replyToChannel(
                            LocalizedMessage.getParsed("commands.color.error.rolenotfound", {"role": input}))
                    }
                } else {
                    activatedCommand.replyToChannel(
                        LocalizedMessage.getParsed("commands.color.error.invalidrole", {"role": input}))
                }
            }
        } else {
            activatedCommand.replyToChannel(LocalizedMessage.getLocalized("commands.color.error.noargs"))
        }
    }


}