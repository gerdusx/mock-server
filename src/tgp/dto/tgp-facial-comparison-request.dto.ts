import { IsNotEmpty } from 'class-validator';

export class TgpFacialComparisonRequestDto {
  @IsNotEmpty()
  selfieImage: string;

  @IsNotEmpty()
  comparisonImage: string;

  @IsNotEmpty()
  scoreThreshold: number;
}
