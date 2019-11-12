import {Entity, Column, ManyToMany, BaseEntity, PrimaryGeneratedColumn} from "typeorm"
import User from "./User"

@Entity()
export default class DuelRequest extends BaseEntity {

    @PrimaryGeneratedColumn()
    requestId: number | undefined

    @Column()
    discordName: string

    @ManyToMany(type => Duel, duel => duel.participants)
    participatingDuels: Duel[] | undefined

    constructor(discordId: string, discordName: string) {
        super()
        this.discordId = discordId
        this.discordName = discordName
    }
}