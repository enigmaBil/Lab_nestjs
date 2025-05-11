import { Subscription } from "rxjs";
import { BaseEntity } from "src/common/base.entity";
import { UserRole } from "src/common/user-role.enum";
import { Gym } from "src/gym/entities/gym.entity";
import { Souscription } from "src/subscription/entities/subscription.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @ManyToMany(() => Gym, (gym) => gym.users, { cascade: true })
    @JoinTable({
        name: 'user_gym',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'gym_id',
            referencedColumnName: 'id',
        },
    })
    gyms: Gym[];

    @OneToMany(() => Souscription, (sub) => sub.user)
    subscriptions: Souscription[];

}
