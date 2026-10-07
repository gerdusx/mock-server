import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { TgpService } from './tgp.service';
import { TgpVerifyPersonRequestDto } from './dto/tgp-verify-person-request.dto';
import { TgpRsaIdVerifyRequestDto } from './dto/tgp-rsa-id-verify-request.dto';
import { TgpDocumentReaderRequestDto } from './dto/tgp-document-reader-request.dto';
import { TgpAddressMatchRequestDto } from './dto/tgp-address-match-request.dto';

@Controller('api')
export class TgpAuthController {
  constructor(private readonly tgpService: TgpService) { }

  @Post('login')
  @HttpCode(200)
  verifyPerson(@Body() request: TgpVerifyPersonRequestDto) {
    return {
      token: "mock-token"
    };
  }
}
