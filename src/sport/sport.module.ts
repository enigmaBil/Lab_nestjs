import { Module } from '@nestjs/common';
import { SportService } from './sport.service';
import { SportController } from './sport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from './entities/sport.entity';
import { Plan } from 'src/plan/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sport, Plan])], 
  exports: [TypeOrmModule, SportService],
  controllers: [SportController],
  providers: [SportService],
})
export class SportModule {}
