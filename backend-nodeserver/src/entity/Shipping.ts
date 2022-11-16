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
import {IsEmail, Length} from "class-validator";
import {Billing} from "./Billing";
import {Order} from "./Order";

@Entity()
@Unique(['email'])
export class Shipping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1, 100)
    firstName: string;

    @Column()
    @Length(1, 100)
    lastName: string;

    @Column()
    @IsEmail()
    @Length(5,100)
    email: string;

    @Column()
    Address: string;

    @Column()
    City: string;

    // @Column()
    // @Length(5, 100)
    // Country: string;

    @Column()
    Province: string;

    @Column()
    PostalCode: string;

    @Column()
    PhoneNumber: number;

    @Column({nullable: true, default: false})
    isActive: boolean;

    @Column({nullable: true, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createAt: Date;

    //
    //
    // @OneToOne(() => Order, order => order.billing)
    // orders: Order[]
}