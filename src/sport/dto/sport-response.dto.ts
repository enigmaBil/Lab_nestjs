import { Expose, Type } from "class-transformer";
import { PlanResponseDto } from "src/plan/dto/plan-response.dto";

export class SportResponseDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;
  
  @Expose()
  @Type(() => PlanResponseDto) // Transformation en DTO pour les plans
  plans: PlanResponseDto[]; // Liste des plans associés à ce sport

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;
}