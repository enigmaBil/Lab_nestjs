import { Expose, Type } from "class-transformer";
import { GymResponseDto } from "src/gym/dto/gym-response.dto";
import { SportResponseDto } from "src/sport/dto/sport-response.dto";

export class PlanResponseDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;

  @Expose()
  @Type(() => SportResponseDto)
  sport: SportResponseDto;

  @Expose()
  @Type(() => GymResponseDto)
  gym: GymResponseDto;
}