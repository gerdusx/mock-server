import { HttpException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { TgpVerifyPersonRequestDto } from './dto/tgp-verify-person-request.dto';
import { TgpRsaIdVerifyRequestDto } from './dto/tgp-rsa-id-verify-request.dto';
import { DevService } from '../dev/dev.service';
import { TgpAddressMatchRequestDto } from './dto/tgp-address-match-request.dto';
import { TgpFacialComparisonRequestDto } from './dto/tgp-facial-comparison-request.dto';
import { TgpAntiMoneyLaunderingRequestDto } from './dto/tgp-anti-money-laundering-request.dto';
import { TgpAntiMoneyLaunderingResponse } from './interfaces/tgp-anti-money-laundering.interface';
import { TgpCreditReportRequestDto } from './dto/tgp-credit-report-request.dto';
import { TgpCreditScoreRequestDto } from './dto/tgp-credit-score-request.dto';

@Injectable()
export class TgpService {
  private responses = [
    require('../../fixtures/identity-verify-person/identity-verify-person_success_with-photo.json'),
    require('../../fixtures/identity-verify-person/identity-verify-person_success_no-photo.json'),
    require('../../fixtures/identity-verify-person/identity-verify-person_success_with-invalid-photo.json'),
  ];

  constructor(private readonly devService: DevService) { }

  verifyPerson(request: TgpVerifyPersonRequestDto) {
    const idNumber = request.id_number;
    const configValue = this.getMockConfigValue('verify_person_03');
    return this.getVerifyPersonResponseByConfig(configValue, idNumber);
  }

  private cloneAndCustomize(template: any, idNumber: string, options: { replacePhoto?: boolean } = {}) {
    const response = JSON.parse(JSON.stringify(template));
    const replacePhoto = options.replacePhoto ?? true;

    // Customize with request data
    response.GoldenSource.IdNumber = idNumber;
    response.GoldenSource.TransactionNo = crypto.randomUUID();
    response.GoldenSource.DhaTransactionNo = `CB${Date.now()}${Math.random().toString().substring(2, 8)}N`;
    response.CRef = crypto.randomBytes(5).toString('hex');

    // Generate deterministic names using Faker with ID-based seed
    const names = this.generateNamesForId(idNumber);
    response.GoldenSource.Name = names.firstName.toUpperCase();
    response.GoldenSource.Surname = names.lastName.toUpperCase();

    // Replace static fixture photos with random selfie images, unless the scenario
    // intentionally needs to preserve the fixture photo payload.
    if (replacePhoto && response.GoldenSource.Photo) {
      response.GoldenSource.Photo = this.getRandomSelfieBase64();
    }

    return response;
  }

  private getRandomSelfieBase64(): string {
    const selfiesDir = path.join(__dirname, '../../fixtures/selfies');
    const files = fs.readdirSync(selfiesDir).filter((f) => f.endsWith('.jpeg'));
    const chosen = files[Math.floor(Math.random() * files.length)];
    return fs.readFileSync(path.join(selfiesDir, chosen)).toString('base64');
  }

  private generateNamesForId(idNumber: string): {
    firstName: string;
    lastName: string;
  } {
    // Convert ID number to a numeric seed
    const hash = crypto.createHash('md5').update(idNumber).digest('hex');
    const seed = parseInt(hash.substring(0, 8), 16);

    // Extract gender from SA ID (digits 7-10: 0000-4999 = female, 5000-9999 = male)
    const genderCode = parseInt(idNumber.substring(6, 10));
    const gender = genderCode < 5000 ? 'female' : 'male';

    // Seed faker with the ID number
    faker.seed(seed);

    // Generate names - same ID will always produce same names
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();

    return { firstName, lastName };
  }

  rsaIdVerify(request: TgpRsaIdVerifyRequestDto) {
    const idNumber = request.id_number;
    const configValue = this.getMockConfigValue('rsa_id_verify_03');
    return this.getRsaIdVerifyResponseByConfig(configValue, idNumber, request);
  }

  /**
   * Clone and customize RSA ID Verify response template
   */
  private cloneAndCustomizeRsaIdVerify(
    template: any,
    idNumber: string,
    request: TgpRsaIdVerifyRequestDto,
  ) {
    const response = JSON.parse(JSON.stringify(template));

    // Customize with request data
    response.response.IdNumber = idNumber;
    response.response.TrackingNumber = crypto.randomUUID();

    // Generate deterministic names using Faker with ID-based seed
    const names = this.generateNamesForId(idNumber);
    response.response.FirstName = names.firstName.toUpperCase();
    response.response.LastName = names.lastName.toUpperCase();

    // Set name match scores based on input (simplified - always 100 for matching)
    response.response.FirstNameResult = '100';
    response.response.LastNameResult = '100';

    // Strip the base64 image from response (too large for logs)
    if (response.response.FacialImage) {
      response.response.FacialImage = '[base64 image stripped for brevity]';
    }

    // Set dates based on ID
    const year = parseInt(idNumber.substring(0, 2));
    const month = idNumber.substring(2, 4);
    const day = idNumber.substring(4, 6);
    const fullYear = year >= 0 && year <= 30 ? 2000 + year : 1900 + year;

    response.response.DateOfBirth = `${fullYear}${month}${day}`;

    return response;
  }

  documentReader() {
    // Check if config override is set
    const configOverride = this.getMockConfigValue('document_reader_11');

    // Map config to fixture file
    const fixtureMap: { [key: string]: string } = {
      'green-book-positive': 'green-book-positive.json',
      'green-book-negative': 'green-book-negative.json',
    };

    const fixture = (configOverride && fixtureMap[configOverride]) || fixtureMap['green-book-positive'];
    const response = require(`../../fixtures/document-reader/${fixture}`);
    return response;
  }

  facialComparison(request: TgpFacialComparisonRequestDto) {
    const configValue = this.getMockConfigValue('facial_comparison_14');
    return this.getFacialComparisonResponseByConfig(configValue);
  }

  antiMoneyLaundering(_request: TgpAntiMoneyLaunderingRequestDto): TgpAntiMoneyLaunderingResponse {
    const configValue = this.getMockConfigValue('anti_money_laundering_01');
    return this.getAntiMoneyLaunderingResponseByConfig(configValue);
  }

  addressMatch(request: TgpAddressMatchRequestDto) {
    const configOverride = this.getMockConfigValue('address_match_04');

    return this.getAddressMatchResponseByConfig(configOverride!, request);
  }

  creditReport(_request: TgpCreditReportRequestDto) {
    const configValue = this.getMockConfigValue('credit_report_06');
    return this.getCreditReportResponseByConfig(configValue);
  }

  creditScore(_request: TgpCreditScoreRequestDto) {
    const configValue = this.getMockConfigValue('get_credit_score_06');
    return this.getCreditScoreResponseByConfig(configValue);
  }

  /**
   * Get mock config value for a specific endpoint
   */
  private getMockConfigValue(endpoint: string): string | null {
    try {
      const configResult = this.devService.getMockConfig();
      if (configResult.config?.identification?.[endpoint]) {
        return configResult.config.identification[endpoint];
      }
      return null;
    } catch (error) {
      console.warn('Failed to read mock config, using default behavior:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * Get verify-person response based on config value
   */
  private getVerifyPersonResponseByConfig(configValue: string | null, idNumber: string) {
    console.log(`Using config-based response: verify-person = ${configValue}`);

    switch (configValue) {
      case 'success_with_photo':
        return this.cloneAndCustomize(this.responses[0], idNumber);

      case 'success_no_photo':
        return this.cloneAndCustomize(this.responses[1], idNumber);

      case 'success_invalid_photo':
        return this.cloneAndCustomize(this.responses[2], idNumber, { replacePhoto: false });

      case 'id_blocked': {
        const response = this.cloneAndCustomize(this.responses[0], idNumber);
        response.GoldenSource.IdBlocked = true;
        response.Status = 'Fail';
        response.GoldenSource.Error = 'ID is blocked';
        response.GoldenSource.ErrorCode = 1001;
        return response;
      }

      case 'deceased': {
        const response = this.cloneAndCustomize(this.responses[0], idNumber);
        response.GoldenSource.DeadIndicator = true;
        response.GoldenSource.DateOfDeath = '20230115';
        response.Status = 'Fail';
        return response;
      }

      case 'server_error':
        throw new HttpException('Server error', 500);

      default:
        console.warn(`Unknown config value: ${configValue}, using success_with_photo`);
        return this.cloneAndCustomize(this.responses[0], idNumber);
    }
  }

  /**
   * Get rsa-id-verify response based on config value
   */
  private getRsaIdVerifyResponseByConfig(
    configValue: string | null,
    idNumber: string,
    request: TgpRsaIdVerifyRequestDto
  ) {
    console.log(`Using config-based response: rsa-id-verify = ${configValue}`);

    const responses = [
      require('../../fixtures/identity-rsa-id-verify/identity-rsa-id-verify_success_with-FaceResult-Identical.json'),
      require('../../fixtures/identity-rsa-id-verify/identity-rsa-id-verify_success_with-FaceResult-missing.json'),
      require('../../fixtures/identity-rsa-id-verify/identity-rsa-id-verify_success_with-FaceResult-notIdentical.json'),
      require('../../fixtures/identity-rsa-id-verify/identity-rsa-id-verify_success_with-FaceResult-null.json'),
      require('../../fixtures/identity-rsa-id-verify/identity-rsa-id-verify_success_with-LivenessResultPass.json'),
    ];

    switch (configValue) {
      case 'face_identical':
        return this.cloneAndCustomizeRsaIdVerify(responses[0], idNumber, request);

      case 'face_missing':
        return this.cloneAndCustomizeRsaIdVerify(responses[1], idNumber, request);

      case 'face_not_identical':
        return this.cloneAndCustomizeRsaIdVerify(responses[2], idNumber, request);

      case 'face_null':
        return this.cloneAndCustomizeRsaIdVerify(responses[3], idNumber, request);

      case 'liveness_pass':
        return this.cloneAndCustomizeRsaIdVerify(responses[4], idNumber, request);

      case 'verification_failed': {
        const response = this.cloneAndCustomizeRsaIdVerify(responses[0], idNumber, request);
        response.response.FaceResult = {
          isIdentical: false,
          confidence: 0.1,
        };
        response.response.FirstNameResult = '0';
        response.response.LastNameResult = '0';
        response.status = 'fail';
        response.response.Status = 'Verification failed';
        return response;
      }

      case 'deceased': {
        const response = this.cloneAndCustomizeRsaIdVerify(responses[0], idNumber, request);
        response.response.DeceasedStatus = 'DECEASED';
        response.response.DeceasedDate = '20230115';
        response.status = 'fail';
        response.response.Status = 'Person is deceased';
        return response;
      }

      case 'server_error':
        throw new HttpException('TGP API temporarily unavailable - simulated error', 500);

      default:
        console.warn(`Unknown config value: ${configValue}, using face_identical`);
        return this.cloneAndCustomizeRsaIdVerify(responses[0], idNumber, request);
    }
  }

  private getAddressMatchResponseByConfig(configValue: string, request: TgpAddressMatchRequestDto) {
    console.log(`Using config-based response: address-match = ${configValue}`);
    switch (configValue) {
      case 'address-match-has-history':
        return require('../../fixtures/address-match/address-match-with-history.json');
      // case 'address-match-no-history':
      //   return require('../../fixtures/address-match/address-match-no-history.json');
      default:
        console.warn(`Unknown config value: ${configValue}, using address-match-has-history`);
        return require('../../fixtures/address-match/address-match-with-history.json');
    }
  }

  private getAntiMoneyLaunderingResponseByConfig(
    configValue: string | null,
  ): TgpAntiMoneyLaunderingResponse {
    console.log(`Using config-based response: anti-money-laundering = ${configValue}`);

    switch (configValue) {
      case 'no_results':
        return require('../../fixtures/anti-money-laundering/anti-money-laundering-no-results.json');

      case 'match_found':
        return require('../../fixtures/anti-money-laundering/anti-money-laundering-match-found.json');

      case 'match_found_compact':
        return require('../../fixtures/anti-money-laundering/anti-money-laundering-match-found-compact.json');

      case 'watchlist_match':
      case 'pep_match':
      case 'negative_media_match': {
        const response = structuredClone(require('../../fixtures/anti-money-laundering/anti-money-laundering-match-found-compact.json')) as TgpAntiMoneyLaunderingResponse;
        const applicant = response.Fields.Applicants_IO.Applicant[0];
        const results = applicant.Attributes.DSWatchlistVerification;
        if (configValue !== 'watchlist_match') results.WlsResults = [];
        if (configValue !== 'pep_match') results.PepResults = [];
        if (configValue !== 'negative_media_match') results.NmResults = [];
        applicant.Attributes.DRWatchlistVerification.MatchCount = results.WlsResults.length + results.PepResults.length + results.NmResults.length;
        return response;
      }

      case 'server_error':
        throw new HttpException('TGP AML API temporarily unavailable - simulated error', 500);

      default:
        console.warn(`Unknown config value: ${configValue}, using no_results`);
        return require('../../fixtures/anti-money-laundering/anti-money-laundering-no-results.json');
    }
  }

  private getCreditReportResponseByConfig(configValue: string | null) {
    console.log(`Using config-based response: credit-report = ${configValue}`);
    switch (configValue) {
      case 'success':
        return require('../../fixtures/credit-report/credit-report-success.json');

      case 'server_error':
        throw new HttpException('TGP Credit Report API temporarily unavailable - simulated error', 500);

      default:
        console.warn(`Unknown config value: ${configValue}, using success`);
        return require('../../fixtures/credit-report/credit-report-success.json');
    }
  }

  private getCreditScoreResponseByConfig(configValue: string | null) {
    console.log(`Using config-based response: credit-score = ${configValue}`);
    switch (configValue) {
      case 'success':
        return require('../../fixtures/credit-score/credit-score-success.json');

      case 'server_error':
        throw new HttpException('TGP Credit Score API temporarily unavailable - simulated error', 500);

      default:
        console.warn(`Unknown config value: ${configValue}, using success`);
        return require('../../fixtures/credit-score/credit-score-success.json');
    }
  }

  private getFacialComparisonResponseByConfig(configValue: string | null) {
    console.log(`Using config-based response: facial-comparison = ${configValue}`);
    const imageQuality = {
      quality: {
        blurScore: 0.05,
        contrast: 0.85,
        qualityLevel: 'HIGH',
        sharpness: 'SHARP',
      },
      faceIndex: 0,
    };

    switch (configValue) {
      case 'match':
        return {
          status: 'success',
          result: {
            status: 'success',
            message: 'Facial comparison completed',
            data: {
              similarity: 0.97,
              interpretation: { confidence: 'HIGH', message: 'Faces match', recommendation: 'ACCEPT' },
              selfieImageQuality: imageQuality,
              comparisonImageQuality: imageQuality,
              isMatch: true,
            },
          },
        };

      case 'no_match':
        return {
          status: 'success',
          result: {
            status: 'success',
            message: 'Facial comparison completed',
            data: {
              similarity: 0.12,
              interpretation: { confidence: 'HIGH', message: 'Faces do not match', recommendation: 'REJECT' },
              selfieImageQuality: imageQuality,
              comparisonImageQuality: imageQuality,
              isMatch: false,
            },
          },
        };

      default:
        return {
          status: 'success',
          result: {
            status: 'success',
            message: 'Facial comparison completed',
            data: {
              similarity: 0.97,
              interpretation: { confidence: 'HIGH', message: 'Faces match', recommendation: 'ACCEPT' },
              selfieImageQuality: imageQuality,
              comparisonImageQuality: imageQuality,
              isMatch: true,
            },
          },
        };
    }
  }
}
