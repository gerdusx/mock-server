import { IsNotEmpty } from 'class-validator';

export class TgpDocumentReaderRequestDto {
  @IsNotEmpty()
  sourceImage: string;
}
