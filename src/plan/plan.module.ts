import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Sport } from 'src/sport/entities/sport.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from 'src/gym/entities/gym.entity';
import { Plan } from './entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Gym, Sport])],
  exports: [PlanService, TypeOrmModule],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
