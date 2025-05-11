import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSubscriptionDto {
    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'Utilisateur qui souscrit' })
    userId: number;

    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'Salle de sport dans laquelle l\'utilisateur souscrit' })
    gymId: number;
}
