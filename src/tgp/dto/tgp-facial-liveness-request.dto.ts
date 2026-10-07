import { IsNotEmpty } from 'class-validator';

export class TgpFacialLivenessRequestDto {
  @IsNotEmpty()
  comparisonImage: string;
}
