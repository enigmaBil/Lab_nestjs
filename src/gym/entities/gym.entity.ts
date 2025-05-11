import { BaseEntity } from "src/common/base.entity";
import { Plan } from "src/plan/entities/plan.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Gym extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column()
    location: string;

    @ManyToMany(() => User, (user) => user.gyms)
    users: User[];

    @OneToMany(() => Plan, (plan) => plan.gym)
    plans: Plan[];
}
