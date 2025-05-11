import { Expose, Type } from "class-transformer";
import { PlanResponseDto } from "src/plan/dto/plan-response.dto";
import { UserResponseDto } from "src/user/dto/user-response.dto";

export class GymResponseDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  location: string;
  @Expose()
  @Type(() => UserResponseDto) // Transformation en DTO pour les utilisateurs
  users: UserResponseDto[];

  @Expose()
  @Type(() => PlanResponseDto) // Transformation en DTO pour les plans
  plans: PlanResponseDto[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;

}