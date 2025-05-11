import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
    @IsNotEmpty()
    @ApiPropertyOptional({ type: Number, description: 'Utilisateur qui souscrit' })
    userId?: number;

    @IsNotEmpty()
    @ApiPropertyOptional({ type: Number, description: 'Salle de sport dans laquelle l\'utilisateur souscrit' })
    gymId?: number;
}
