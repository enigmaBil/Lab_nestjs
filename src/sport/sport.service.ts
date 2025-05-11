import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { In, Repository } from 'typeorm';
import { SportResponseDto } from './dto/sport-response.dto';
import { Sport } from './entities/sport.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,
    @InjectRepository(Sport)
    private sportRepo: Repository<Sport>,

  ) {}

  async create(dto: CreateSportDto): Promise<SportResponseDto> {
    const { plans, ...sportData } = dto;
    const sport = this.sportRepo.create(sportData);

    if (plans?.length) {
      const planEntities = await this.planRepo.findBy({ id: In(plans) });
      sport.plans = planEntities;
    }
    await this.sportRepo.save(sport);
    return plainToInstance(SportResponseDto, sport, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<SportResponseDto[]> {
    const sports = await this.sportRepo.find({ relations: ['plans'] });
    return plainToInstance(SportResponseDto, sports, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<SportResponseDto> {
    const sport = await this.sportRepo.findOne({ where: { id }, relations: ['plans'] });
    if (!sport) throw new NotFoundException(`Sport ${id} not found`);
    return plainToInstance(SportResponseDto, sport, { excludeExtraneousValues: true });
  }

  async update(id: number, dto: UpdateSportDto): Promise<SportResponseDto> {
    const { plans, ...sportData } = dto;
    const sport = await this.sportRepo.preload({ id, ...sportData });
    if (!sport) throw new NotFoundException(`Sport ${id} not found`);

    if (plans?.length) {
      const planEntities = await this.planRepo.findBy({ id: In(plans) });
      sport.plans = planEntities;
    }
    
    await this.sportRepo.save(sport);
    return plainToInstance(SportResponseDto, sport, { excludeExtraneousValues: true });
  }

  async remove(id: number): Promise<void> {
    const sport = await this.sportRepo.findOne({ where: { id } });
    if (!sport) throw new NotFoundException(`Sport ${id} not found`);
    await this.sportRepo.remove(sport);
  }
}
