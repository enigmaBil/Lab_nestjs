import { PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
        id: number;
    @Column()
    @Generated("uuid")
    uuid: string;
    @CreateDateColumn(
        {
            type: "time without time zone", update: false,
        }
    )
    created_at: Date;
    @UpdateDateColumn(
        {
            type: "time without time zone",
        }
    )
    updated_at: Date;
    @DeleteDateColumn(
        {
            type: "time without time zone",
        }
    )
    deleted_at: Date;
}