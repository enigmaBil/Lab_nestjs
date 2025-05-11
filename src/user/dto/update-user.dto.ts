import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from 'src/common/user-role.enum';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    password?: string;

    @IsEnum(UserRole, {message: 'Le rôle doit être un de ces valeurs: ADMIN, COACH, ou CLIENT'})
    @Transform(({ value }) => value?.toUpperCase() || UserRole.CLIENT)
    @ApiProperty({ enum: UserRole, default: UserRole.CLIENT })
    role?: string;
}
