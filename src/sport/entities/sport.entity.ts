import { BaseEntity } from "src/common/base.entity";
import { SportType } from "src/common/sport.enum";
import { Plan } from "src/plan/entities/plan.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Sport extends BaseEntity {
    @Column({ type: 'enum', enum: SportType })
    name: SportType;

    @OneToMany(() => Plan, (plan) => plan.sport)
    plans: Plan[];
}
