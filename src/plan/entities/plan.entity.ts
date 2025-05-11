import { BaseEntity } from "src/common/base.entity";
import { PlanType } from "src/common/plan.enum";
import { Gym } from "src/gym/entities/gym.entity";
import { Sport } from "src/sport/entities/sport.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Plan extends BaseEntity {
    @Column({ type: 'enum', enum: PlanType })
    name: PlanType;

    @Column('text')
    description: string;

    @Column('decimal')
    price: number;

    @ManyToOne(() => Sport, (sport) => sport.plans)
    sport: Sport;

    @ManyToOne(() => Gym, (gym) => gym.plans)
    gym: Gym;

}
