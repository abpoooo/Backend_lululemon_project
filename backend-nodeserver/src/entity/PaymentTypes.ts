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



@Entity()
export class PaymentTypes {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, default: false})
    types: string;

    @OneToMany(() => Payment, payment => payment.types)
    payments: Payment[]


}