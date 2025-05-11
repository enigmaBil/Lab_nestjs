import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsString, IsNotEmpty, IsDecimal, IsNumber, IsOptional, IsPositive } from "class-validator";
import { PlanType } from "src/common/plan.enum";
import { CreateGymDto } from "src/gym/dto/create-gym.dto";
import { CreateSportDto } from "src/sport/dto/create-sport.dto";

export class CreatePlanDto {
     @IsOptional()
    @IsEnum(PlanType)
    @ApiProperty({ enum: PlanType })
    name: PlanType;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    price: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'ID du sport' })
    sportId: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'ID de la salle de sport' })
    gymId: number;
}
