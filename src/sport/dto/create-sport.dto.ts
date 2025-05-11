import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { SportType } from "src/common/sport.enum";

export class CreateSportDto {
    @IsEnum(SportType)
    @ApiProperty()
    name: SportType;

    @IsArray()
    @IsOptional()
    @ApiProperty({ type: [Number], description: 'Liste des plans associés au sport' })
    plans?: number[];
}
