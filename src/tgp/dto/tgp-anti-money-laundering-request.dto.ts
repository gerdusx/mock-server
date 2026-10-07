import { IsIn, IsNotEmpty } from 'class-validator';

export class TgpAntiMoneyLaunderingRequestDto {
  @IsNotEmpty()
  date_of_birth!: string;

  @IsNotEmpty()
  first_name!: string;

  @IsNotEmpty()
  last_name!: string;

  @IsNotEmpty()
  @IsIn(['M', 'F'], { message: 'gender must be M or F' })
  gender!: 'M' | 'F';

  @IsNotEmpty()
  @IsIn(['ZAF'], { message: 'country_code must be ZAF' })
  country_code!: 'ZAF';
}
