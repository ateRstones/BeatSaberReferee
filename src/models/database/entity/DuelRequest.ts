import {Entity, Column, ManyToMany, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinTable} from "typeorm"
import User from "./User"

@Entity()
export default class DuelRequest extends BaseEntity {

    @PrimaryGeneratedColumn()
    requestId: number | undefined

    @ManyToOne(type => User)
    @JoinTable()
    requestingUser: User

    @ManyToOne(type => User)
    @JoinTable()
    receivingUser: User

    constructor(requestingUser: User, receivingUser: User) {
        super()
        this.requestingUser = requestingUser
        this.receivingUser = receivingUser
    }
}