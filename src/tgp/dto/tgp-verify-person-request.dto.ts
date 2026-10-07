import { IsNotEmpty, IsBoolean, IsOptional, IsString } from 'class-validator';

export class TgpVerifyPersonRequestDto {
  @IsNotEmpty()
  @IsString()
  id_number: string;

  @IsOptional()
  @IsBoolean()
  include_photo?: boolean;

  @IsOptional()
  @IsBoolean()
  preferred_cache?: boolean;
}
