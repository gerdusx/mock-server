import { IsNotEmpty } from 'class-validator';

export class TgpCreditScoreRequestDto {
  @IsNotEmpty()
  id_number: string;
}
