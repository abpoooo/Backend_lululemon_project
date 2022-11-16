import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    ManyToMany, JoinTable
} from "typeorm";
import {Payment} from "./Payment";
import {stat} from "fs";

@Entity()
export class PaymentStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, default: false})
    status: string;


    @OneToMany(() => Payment, payment => payment.status)
    payments: Payment[]



}