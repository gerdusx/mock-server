import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { TgpService } from './tgp.service';
import { TgpVerifyPersonRequestDto } from './dto/tgp-verify-person-request.dto';
import { TgpRsaIdVerifyRequestDto } from './dto/tgp-rsa-id-verify-request.dto';
import { TgpDocumentReaderRequestDto } from './dto/tgp-document-reader-request.dto';
import { TgpAddressMatchRequestDto } from './dto/tgp-address-match-request.dto';
import { TgpFacialComparisonRequestDto } from './dto/tgp-facial-comparison-request.dto';
import { TgpAntiMoneyLaunderingRequestDto } from './dto/tgp-anti-money-laundering-request.dto';
import { TgpCreditReportRequestDto } from './dto/tgp-credit-report-request.dto';
import { TgpCreditScoreRequestDto } from './dto/tgp-credit-score-request.dto';

@Controller('identification')
export class TgpController {
  constructor(private readonly tgpService: TgpService) { }

  private logRequest(endpoint: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log('\n' + '='.repeat(60));
    console.log(`🎭 MOCK SERVER - ${timestamp}`);
    console.log(`📍 Controller: TgpController`);
    console.log(`🔗 Endpoint: POST /tgp/${endpoint}`);
    if (data) {
      console.log(`📦 Request:`, JSON.stringify(data, null, 2));
    }
    console.log('='.repeat(60) + '\n');
  }

  @Post('verify_person_03')
  @HttpCode(200)
  verifyPerson(@Body() request: TgpVerifyPersonRequestDto) {
    this.logRequest('verify_person_03', request);
    return this.tgpService.verifyPerson(request);
  }

  @Post('rsa_id_verify_03')
  @HttpCode(200)
  rsaIdVerify(@Body() request: TgpRsaIdVerifyRequestDto) {
    this.logRequest('rsa_id_verify_03', request);
    return this.tgpService.rsaIdVerify(request);
  }

  @Post('document_reader_11')
  @HttpCode(200)
  documentReader(@Body() request: TgpDocumentReaderRequestDto) {
    this.logRequest('document-reader', request);
    return this.tgpService.documentReader();
  }

  @Post('address_match_04')
  @HttpCode(200)
  addressMatch(@Body() request: TgpAddressMatchRequestDto) {
    this.logRequest('address_match_04', request);
    return this.tgpService.addressMatch(request);
  }

  @Post('facial_comparison_14')
  @HttpCode(200)
  facialComparison(@Body() request: TgpFacialComparisonRequestDto) {
    this.logRequest('facial_comparison_14');
    return this.tgpService.facialComparison(request);
  }

  @Post('anti_money_laundering_01')
  @HttpCode(200)
  antiMoneyLaundering(@Body() request: TgpAntiMoneyLaunderingRequestDto) {
    this.logRequest('anti_money_laundering_01', request);
    return this.tgpService.antiMoneyLaundering(request);
  }

  @Post('credit_report_06')
  @HttpCode(200)
  creditReport(@Body() request: TgpCreditReportRequestDto) {
    this.logRequest('credit_report_06', request);
    return this.tgpService.creditReport(request);
  }

  @Post('get_credit_score_06')
  @HttpCode(200)
  creditScore(@Body() request: TgpCreditScoreRequestDto) {
    this.logRequest('get_credit_score_06', request);
    return this.tgpService.creditScore(request);
  }
}
