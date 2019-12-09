import {Entity, Column, ManyToMany, PrimaryColumn, BaseEntity, OneToMany, In, Like} from "typeorm"
import Duel, { DuelState } from "./Duel"
import DuelRequest from "./DuelRequest"

@Entity()
export default class User extends BaseEntity {

    @PrimaryColumn()
    discordId: string

    @Column()
    discordName: string

    @ManyToMany(type => Duel, duel => duel.participants)
    participatingDuels: Duel[] | undefined

    @OneToMany(type => DuelRequest, request => request.requestingUser)
    requestedDuels: DuelRequest[] | undefined

    @OneToMany(type => DuelRequest, request => request.receivingUser)
    receivedDuels: DuelRequest[] | undefined

    constructor(discordId: string, discordName: string) {
        super()
        this.discordId = discordId
        this.discordName = discordName
    }

    public async gotRequestedBy(user: User): Promise<boolean> {
        let requ = await DuelRequest.findOne({"requestingUser": user, "receivingUser": this})
        return requ !== undefined
    }

    public async hasRequested(user: User): Promise<boolean> {
        let requ = await DuelRequest.findOne({"requestingUser": this, "receivingUser": user})
        return requ !== undefined
    }

    public async getDuelWith(user: User, stateList: DuelState[] = []): Promise<Duel | undefined> {
        let extendedUser = await User.findOne(this, {relations: ["participatingDuels", "participatingDuels.participants"]})
        
        if(extendedUser !== undefined) {
            for(let x in <Duel[]>extendedUser.participatingDuels) {
                let duel = (<Duel[]>extendedUser.participatingDuels)[x]
                if(stateList.includes(duel.state) && duel.participants !== undefined) {
                    for(let u in (<User[]>duel.participants)) {
                        let userDuel = (<User[]>duel.participants)[u]
                        if(userDuel.discordId === user.discordId) {
                            return duel
                        }
                    }
                }
            }
        }

        return undefined
    }

    public async hasDuelWith(user: User): Promise<boolean> {
        return await this.getDuelWith(user, [DuelState.Created, DuelState.Running]) !== undefined
    }
}