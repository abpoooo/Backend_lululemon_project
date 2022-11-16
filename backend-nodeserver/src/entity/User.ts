import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, OneToMany} from "typeorm";
import {IsEmail, Length, Max, Min} from "class-validator";
import {Order} from "./Order";



// annotation
@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1,100)
    firstname: string;

    @Column()
    @Length(1,100)
    lastname: string;

    @Column({nullable:true})
        // @Max(100)
        // @Min(15)
    age: number;

    @Column()
    @IsEmail()
    @Length(5,150)
    email: string;

    @Column()
    @Length(6,200)
    password: string;

    @Column({nullable: true, default: false})
    isStaff: boolean;

    @Column({nullable: true, default: false})
    isActive: boolean;

    @Column({nullable: true, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createAt: Date;

    @Column()
    @CreateDateColumn()
    updateAt: Date;

    //relation


}






