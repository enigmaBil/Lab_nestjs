import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSportDto } from './create-sport.dto';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { SportType } from 'src/common/sport.enum';

export class UpdateSportDto extends PartialType(CreateSportDto) {
    @IsEnum(SportType)
    @ApiProperty()
    name?: SportType;

    @IsArray()
    @IsOptional()
    @ApiProperty({ type: [Number], description: 'Liste des plans associés au sport' })
    plans?: number[];
}
