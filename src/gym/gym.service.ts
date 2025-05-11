import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Gym } from './entities/gym.entity';
import { GymResponseDto } from './dto/gym-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(Gym)
    private gymRepo: Repository<Gym>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Plan)
    private planRepo: Repository<Plan>
  ) {}

  async create(dto: CreateGymDto): Promise<GymResponseDto> {
    const { users, plans, ...gymData } = dto;
    const gym = this.gymRepo.create(gymData);

    if (users?.length) {
      const userEntities = await this.userRepo.findBy({id: In(users)});
      gym.users = userEntities;
    }

    if (plans?.length) {
      const planEntities = await this.planRepo.findBy({id: In(plans)});
      gym.plans = planEntities;
    }

    await this.gymRepo.save(gym);
    return plainToInstance(GymResponseDto, gym, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<GymResponseDto[]> {
    const gyms = await this.gymRepo.find({ relations: ['users', 'plans'] });
    return plainToInstance(GymResponseDto, gyms, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<GymResponseDto> {
    const gym = await this.gymRepo.findOne({ where: {id}, relations: ['users', 'plans'] });
    if (!gym) throw new NotFoundException(`Gym ${id} not found`);
    return plainToInstance(GymResponseDto, gym, { excludeExtraneousValues: true });
  }

  async update(id: number, dto: UpdateGymDto): Promise<GymResponseDto> {
    const { users, plans, ...gymData } = dto;
    const gym = await this.gymRepo.preload({ id, ...gymData });

    if (!gym) throw new NotFoundException(`Gym ${id} not found`);

    if (users?.length) {
      const userEntities = await this.userRepo.findBy({ id: In(users) });
      gym.users = userEntities;
    }

    if (plans?.length) {
      const planEntities = await this.planRepo.findBy({ id: In(plans) });
      gym.plans = planEntities;
    }
    if (!gym) throw new NotFoundException(`Gym ${id} not found`);

    await this.gymRepo.save(gym);
    return plainToInstance(GymResponseDto, gym, { excludeExtraneousValues: true });
  }

  async remove(id: number): Promise<void> {
    const gym = await this.gymRepo.findOne({where: {id}});
    if (!gym) throw new NotFoundException(`Gym ${id} not found`);
    await this.gymRepo.remove(gym);
  }
}
