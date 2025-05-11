import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from 'src/gym/entities/gym.entity';
import { Sport } from 'src/sport/entities/sport.entity';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { plainToInstance } from 'class-transformer';
import { PlanResponseDto } from './dto/plan-response.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,

    @InjectRepository(Gym)
    private gymRepo: Repository<Gym>,

    @InjectRepository(Sport)
    private sportRepo: Repository<Sport>,
  ) {}

  async create(dto: CreatePlanDto): Promise<PlanResponseDto> {
    const { gymId, sportId, ...planData } = dto;

    const gym = await this.gymRepo.findOneBy({ id:gymId});
    if (!gym) throw new NotFoundException(`Gym ${gymId} not found`);

    const sport = await this.sportRepo.findOneBy({ id: sportId });
    if (!sport) throw new NotFoundException(`Sport ${sportId} not found`);

    const plan = this.planRepo.create({ ...planData, gym, sport });
    await this.planRepo.save(plan);
    return plainToInstance(PlanResponseDto, plan, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.planRepo.find({ relations: ['gym', 'sport'] });
    return plainToInstance(PlanResponseDto, plans, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<PlanResponseDto> {
    const plan = await this.planRepo.findOne({ where: { id }, relations: ['gym', 'sport'] });
    if (!plan) throw new NotFoundException(`Plan ${id} not found`);
    return plainToInstance(PlanResponseDto, plan, { excludeExtraneousValues: true });
  }

  async update(id: number, dto: UpdatePlanDto): Promise<PlanResponseDto> {
    const { gymId, sportId, ...data } = dto;

    const plan = await this.planRepo.preload({ id, ...data });
    if (!plan) throw new NotFoundException(`Plan ${id} not found`);

    if (gymId) {
      const gym = await this.gymRepo.findOneBy({ id: gymId });
      if (!gym) throw new NotFoundException(`Gym ${gymId} not found`);
      plan.gym = gym;
    }

    if (sportId) {
      const sport = await this.sportRepo.findOneBy({ id: sportId });
      if (!sport) throw new NotFoundException(`Sport ${sportId} not found`);
      plan.sport = sport;
    }

    await this.planRepo.save(plan);
    return plainToInstance(PlanResponseDto, plan, { excludeExtraneousValues: true });
  }

  async remove(id: number): Promise<void> {
    const plan = await this.planRepo.findOneBy({ id });
    if (!plan) throw new NotFoundException(`Plan ${id} not found`);
    await this.planRepo.remove(plan);
  }
}
