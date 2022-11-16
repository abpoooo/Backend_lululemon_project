import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    ManyToMany, JoinTable, OneToOne, Generated, UpdateDateColumn
} from "typeorm";
import {Length, Min} from "class-validator";
import {User} from "./User";
// import {Billing} from "./Billing";
import {Shipping} from "./Shipping";
import {OrderStatus} from "./OrderStatus";
import order from "../routes/order";
import {PaymentTypes} from "./PaymentTypes";
import {PaymentStatus} from "./PaymentStatus";
import {Payment} from "./Payment";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated('uuid')
    orderNumber: string;

    @Column('decimal', {precision: 5, scale:2})
    @Min(0)
    beforeTax: number

    @Column('decimal', {precision: 5, scale:2})
    @Min(0)
    taxRate: number

    @Column('decimal', {precision: 5, scale:2})
    @Min(0)
    tax: number

    @Column()
    quantity: number

    @Column('decimal', {precision: 5, scale:2})
    @Min(0)
    subtotal: number

    @Column('simple-json')
    products: {products: string}


    @Column({nullable: true, default: false})
    isActive: boolean;

    @Column({nullable: true, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createAt: Date;

    @Column()
    @UpdateDateColumn()
    update: Date

    //relation

    // @OneToOne(() => Billing, billing=>billing.orders)
    // billing:Billing[]
    //
    // @OneToOne(() => Billing, shipping=>shipping.orders)
    // shipping: Shipping[]
    //relation

    // @ts-ignore
    @ManyToOne(() => OrderStatus, orderStatus=>orderStatus.order, {eager:true})
    orderStatus: OrderStatus;


    @ManyToOne(() => Payment, payment=>payment.order, {eager:true})
    payment: Payment;

}