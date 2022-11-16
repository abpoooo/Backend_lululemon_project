import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Buffer} from "buffer";
import {Length} from "class-validator";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: string

    @Column({nullable: true, type: "blob"})
    image: Buffer

    @Column()
    productId: string

    @Column()
    title: string;

    @Column()
    @Length(1, 200)
    comments: string;

    @Column("int")
    rate: number;

    @Column({nullable: true, default: false})
    isDelete: boolean;

    @Column()
    @CreateDateColumn()
    create: Date

    @Column()
    @UpdateDateColumn()
    update: Date

}
