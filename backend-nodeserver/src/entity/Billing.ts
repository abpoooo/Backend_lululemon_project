import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    ManyToMany, JoinTable, OneToOne
} from "typeorm";
import {Length} from "class-validator";
import {Order} from "./Order";

@Entity()
export class Billing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(10, 30)
    Address: string;

    @Column()
    @Length(5, 30)
    City: string;

    @Column()
    @Length(5, 30)
    Country: string;

    @Column()
    Province: string;

    @Column()
    @Length(5, 30)
    PostalCode: string;

    @Column()
    PhoneNumber: number;

    @Column()
    @CreateDateColumn()
    createAt: Date;
    //
    //
    // @OneToOne(() => Order, order => order.billing)
    // orders: Order[]
}
