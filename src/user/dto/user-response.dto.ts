import { Expose, Type } from "class-transformer";
import { GymResponseDto } from "src/gym/dto/gym-response.dto";
import { SouscriptionResponseDto } from "src/subscription/dto/subscription-response.dto";

export class UserResponseDto{
    @Expose()
    id: number;

    @Expose()
    uuid: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    @Type(() => GymResponseDto) // Transformation en DTO pour les gyms
    gyms: GymResponseDto[];  // Détails des gyms auxquels l'utilisateur est inscrit

    @Expose()
    @Type(() => SouscriptionResponseDto) // Transformation en DTO pour les souscriptions
    subscriptions: SouscriptionResponseDto[];  // Détails des souscriptions de l'utilisateur

    @Expose()
    created_at: Date;

    @Expose()
    updated_at: Date;

    deleted_at: Date;
}