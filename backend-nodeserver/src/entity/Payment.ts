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
import {PaymentStatus} from "./PaymentStatus";
import {PaymentTypes} from "./PaymentTypes";
import {Order} from "./Order";

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cardNumber: number

    // @Column()
    // cardHolder: string;

    @Column()
    expiryMonth: number;

    @Column()
    expiryYear: number;

    // @Column()
    // CVV: number;

    @Column({nullable: true, default: false})
    isActive: boolean;

    @Column({nullable: true, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    time: Date;




    // @Column('enum', {nullable: false, default: 'order received'})
    // status: 'completed' | 'failed' | 'pending'
    //
    // @Column('enum', {nullable: false, default: 'credit'})
    // type: 'paypal' | 'easyPay' | 'credit'

    @Column()
    @CreateDateColumn()
    createAt: Date;

    @ManyToOne(() => PaymentStatus, status=>status.payments)
    status: PaymentStatus;

    @ManyToOne(() => PaymentTypes, types=>types.payments)
    types: PaymentTypes;

    @OneToMany(() => Order, order => order.payment)
    order: Order[]


}