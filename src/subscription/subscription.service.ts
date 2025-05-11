import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from 'src/gym/entities/gym.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Souscription } from './entities/subscription.entity';
import { SouscriptionResponseDto } from './dto/subscription-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Souscription)
    private subscriptionRepo: Repository<Souscription>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Gym)
    private gymRepo: Repository<Gym>,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<SouscriptionResponseDto> {
    const { gymId, userId, ...subscriptionData } = dto;

    const gym = await this.gymRepo.findOneBy({ id: gymId });
    if (!gym) throw new NotFoundException(`Gym ${gymId} not found`);

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const subscription = this.subscriptionRepo.create({
      ...subscriptionData,
      gym,
      user,
    });
    await this.subscriptionRepo.save(subscription);
    return plainToInstance(SouscriptionResponseDto, subscription, {excludeExtraneousValues: true});
  }

  async findAll(): Promise<SouscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepo.find({ relations: ['gym', 'user'] });
    return plainToInstance(SouscriptionResponseDto, subscriptions, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<SouscriptionResponseDto> {
    const subscription = await this.subscriptionRepo.findOne({ where: { id }, relations: ['gym', 'user'] });
    if (!subscription) throw new NotFoundException(`Subscription ${id} not found`);
    return plainToInstance(SouscriptionResponseDto, subscription, { excludeExtraneousValues: true });
  }

  async update(id: number, dto: UpdateSubscriptionDto): Promise<SouscriptionResponseDto> {
    const { gymId, userId, ...subscriptionData } = dto;
    const subscription = await this.subscriptionRepo.preload({ id, ...subscriptionData });
    if (!subscription) throw new NotFoundException(`Subscription ${id} not found`);
    if (gymId) {
      const gym = await this.gymRepo.findOneBy({ id: gymId });
      if (!gym) throw new NotFoundException(`Gym ${gymId} not found`);
      subscription.gym = gym;
    }

    if (userId) {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw new NotFoundException(`User ${userId} not found`);
      subscription.user = user;
    }
    await this.subscriptionRepo.save(subscription);
    return plainToInstance(SouscriptionResponseDto, subscription, { excludeExtraneousValues: true });
  }

  async remove(id: number): Promise<void> {
    const subscription = await this.subscriptionRepo.findOne({ where: { id } });
    if (!subscription) throw new NotFoundException(`Subscription ${id} not found`);
    await this.subscriptionRepo.remove(subscription);
  }
}
