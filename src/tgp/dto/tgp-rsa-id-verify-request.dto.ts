import { IsNotEmpty } from 'class-validator';

export class TgpRsaIdVerifyRequestDto {
  @IsNotEmpty()
  id_number: string;

  @IsNotEmpty()
  firstnames: string;

  lastname: string;

  @IsNotEmpty()
  b64_string: string;

  reason: string;

  add_safps: boolean;
}
