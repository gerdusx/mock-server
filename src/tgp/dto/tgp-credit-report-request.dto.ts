import { IsIn, IsNotEmpty } from 'class-validator';

export class TgpCreditReportRequestDto {
  @IsNotEmpty()
  id_number: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  @IsIn(['M', 'F'], { message: 'gender must be M or F' })
  gender: 'M' | 'F';

  @IsNotEmpty()
  date_of_birth: string;
}
