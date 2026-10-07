import { Controller, Post, Body, HttpStatus, HttpCode, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordlessStartDto } from './dto/passwordless-start.dto';
import { OauthTokenDto } from './dto/oauth-token.dto';

@Controller('auth0')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('passwordless/start')
  @HttpCode(HttpStatus.OK)
  passwordlessStart(@Body() passwordlessStartDto: PasswordlessStartDto) {
    return this.authService.passwordlessStart(passwordlessStartDto);
  }

  @Post('oauth/token')
  @HttpCode(HttpStatus.OK)
  oauthToken(@Body() oauthTokenDto: OauthTokenDto) {
    if (oauthTokenDto.grant_type === 'http://auth0.com/oauth/grant-type/passwordless/otp') {
      return this.authService.verifyPasswordlessCode(oauthTokenDto);
    } else if (oauthTokenDto.grant_type === 'client_credentials') {
      return this.authService.clientCredentialsExchange(oauthTokenDto);
    }
  }

  @Get('.well-known/jwks.json')
  getJwks() {
    return this.authService.getJwks();
  }

  @Get('userinfo')
  getUserInfo(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace(/^Bearer\s+/i, '') ?? '';
    return this.authService.getUserInfo(token);
  }
}
