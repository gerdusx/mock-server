import { IsNotEmpty } from 'class-validator';

export class TgpAddressMatchRequestDto {
  @IsNotEmpty()
  id_number: string;
}
