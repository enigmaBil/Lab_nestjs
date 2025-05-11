import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class CreateGymDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    location: string;

    @IsArray()
    @IsOptional()
    @ApiProperty({ type: [Number], description: 'Liste des utilisateurs à ajouter à la salle de sport' })
    users?: number[];

    @IsArray()
    @IsOptional()
    @ApiProperty({ type: [Number], description: 'Liste des plans à ajouter à la salle de sport' })
    plans?: number[];
}
