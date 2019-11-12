import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, BaseEntity} from "typeorm"
import User from "./User"

export enum DuelState {
    Created,
    Running,
    Finished,
    Deleted
}

@Entity()
export default class Duel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column()
    state: DuelState = DuelState.Created

    @OneToOne(type => User)
    @JoinTable()
    winner: User | undefined

    @ManyToMany(type => User, user => user.participatingDuels)
    @JoinTable()
    participants: User[] | undefined
}