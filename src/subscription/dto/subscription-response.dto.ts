import { Expose, Type } from "class-transformer";
import { GymResponseDto } from "src/gym/dto/gym-response.dto";
import { UserResponseDto } from "src/user/dto/user-response.dto";

export class SouscriptionResponseDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  @Type(() => UserResponseDto) 
  user: UserResponseDto;

  @Expose()
  @Type(() => GymResponseDto)
  gym: GymResponseDto;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;
}