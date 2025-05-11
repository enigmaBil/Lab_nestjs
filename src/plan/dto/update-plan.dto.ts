import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-plan.dto';
import { IsEnum, IsString, IsNotEmpty, IsDecimal, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { PlanType } from 'src/common/plan.enum';
import { CreateGymDto } from 'src/gym/dto/create-gym.dto';
import { CreateSportDto } from 'src/sport/dto/create-sport.dto';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
    @IsOptional()
    @IsEnum(PlanType)
    @ApiPropertyOptional({ enum: PlanType })
    name?: PlanType;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    description?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiPropertyOptional()
    price?: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ description: 'ID du sport' })
    sportId?: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ description: 'ID de la salle de sport' })
    gymId?: number;
}
