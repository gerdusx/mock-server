import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DevService } from './dev.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get('users')
  findAllUsers() {
    return this.devService.findAllUsers();
  }

  @Get('users/index/:index')
  findUserByIndex(@Param('index') index: string) {
    const indexNum = parseInt(index, 10);
    if (isNaN(indexNum)) {
      return { error: 'Index must be a number' };
    }
    return this.devService.findUserByIndex(indexNum);
  }

  @Get('users/mobile/:mobile')
  findUserByMobile(@Param('mobile') mobile: string) {
    return this.devService.findUserByMobile(mobile);
  }

  @Get('users/id/:idNumber')
  findUserByIdNumber(@Param('idNumber') idNumber: string) {
    return this.devService.findUserByIdNumber(idNumber);
  }

  @Get('users/random')
  findRandomUser() {
    return this.devService.findRandomUser();
  }

  @Post('seed-results')
  saveSeedResults(@Body() results: any) {
    return this.devService.saveSeedResults(results);
  }

  @Get('seed-results')
  getSeedResults() {
    return this.devService.getSeedResults();
  }

  @Get('selfie-base64')
  getSelfieBase64() {
    // Read the actual selfie.jpeg file and convert to base64
    // Use process.cwd() to get project root, then reference src directory
    const filePath = path.join(
      process.cwd(),
      'src',
      'dev',
      'data',
      'selfie.jpeg',
    );
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');

    return {
      base64: base64Image,
      dataUrl: `data:image/jpeg;base64,${base64Image}`,
      format: 'jpeg',
      description: 'Real selfie image from data/selfie.jpeg',
    };
  }

  @Get('mock-config')
  getMockConfig() {
    return this.devService.getMockConfig();
  }

  @Post('mock-config')
  setMockConfig(@Body() config: any) {
    return this.devService.setMockConfig(config);
  }

  @Post('mock-config/reset')
  resetMockConfig() {
    return this.devService.resetMockConfig();
  }
}
