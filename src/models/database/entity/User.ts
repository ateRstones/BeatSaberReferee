import {Entity, Column, ManyToMany, PrimaryColumn, BaseEntity, OneToMany} from "typeorm"
import Duel from "./Duel"
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
}