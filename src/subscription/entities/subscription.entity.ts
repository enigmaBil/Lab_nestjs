import { BaseEntity } from "src/common/base.entity";
import { Gym } from "src/gym/entities/gym.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity()
export class Souscription extends BaseEntity {

    @ManyToOne(() => User, (user) => user.subscriptions)
    user: User;

    @ManyToOne(() => Gym, { eager: false })
    gym: Gym;

}
