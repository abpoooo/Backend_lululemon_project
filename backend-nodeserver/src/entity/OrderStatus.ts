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
import {Length, Min} from "class-validator";
import {Payment} from "./Payment";
import {Order} from "./Order";
import order from "../routes/order";

@Entity()
export class OrderStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, default: 'pending'})
    status: string;



    @OneToMany(() => Order, order => order.orderStatus)
    order: Order[]



}