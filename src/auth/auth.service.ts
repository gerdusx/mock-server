import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { PasswordlessStartDto } from './dto/passwordless-start.dto';
import { OauthTokenDto } from './dto/oauth-token.dto';
import { pem2jwk } from 'pem-jwk';


@Injectable()
export class AuthService {
  private privateKey: string;
  private publicKey: string;
  private domain: string;

  constructor(private readonly configService: ConfigService) {
    this.privateKey = this.loadPrivateKey();
    this.publicKey = this.loadPublicKey();
    console.log("privateKey", this.privateKey);
    console.log("publicKey", this.publicKey);
    this.domain = this.configService.get<string>('AUTH0_DOMAIN', 'http://mock-server:5000/auth0');
    // this.domain = this.configService.get<string>('AUTH0_DOMAIN', 'http://localhost:5000/auth0');
    // this.domain = 'http://localhost:5000/auth0'; // for tests
  }

  private loadPrivateKey(): string {
    const keyPath = path.join(__dirname, '../../keys/private-key.pem');
    return fs.readFileSync(keyPath, 'utf8');
  }

  private loadPublicKey(): string {
    const keyPath = path.join(__dirname, '../../keys/public-key.pem');
    return fs.readFileSync(keyPath, 'utf8');
  }


  passwordlessStart(passwordlessStartDto: PasswordlessStartDto) {
    return {
      _id: '6971dbf3d584001f5ca3a95b',
      phone_number: passwordlessStartDto.phone_number,
      phone_verified: false,
      request_language: null,
    };
  }

  verifyPasswordlessCode(oauthTokenDto: OauthTokenDto) {

    const audience = oauthTokenDto.audience ?? 'https://mock.betterid.local';

    const now = Math.floor(Date.now() / 1000);
    const phoneNumber = oauthTokenDto.username ?? '';

    // Generate deterministic sub based on phone number
    const sub = this.generateSubId(phoneNumber);

    const permissions =
      Array.isArray(oauthTokenDto.permissions) &&
      oauthTokenDto.permissions.every((permission) => typeof permission === 'string')
        ? oauthTokenDto.permissions
        : [];

    const payload = {
      iss: `${this.domain}/`,
      sub: sub,
      aud: [
        audience,
        `${this.domain}/userinfo`
      ],
      iat: now,
      exp: now + 86400,
      scope: oauthTokenDto.scope || 'openid profile',
      gty: 'password',
      azp: oauthTokenDto.client_id,
      ...(permissions.length > 0 ? { permissions } : {}),
    };

    // Sign with RS256 using your private key
    const accessToken = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      keyid: 'Y7qHEd7zoL6wRQDqMGuL3', // Must match a kid in your JWKS
      header: {
        typ: 'JWT',
        alg: 'RS256',
        kid: 'Y7qHEd7zoL6wRQDqMGuL3' // Must match a kid in your JWKS
      }
    });

    return {
      access_token: accessToken,
      id_token: accessToken,
      scope: 'openid profile',
      expires_in: 86400,
      token_type: 'Bearer',
    };
  }

  private phoneToSubSegment(raw: string): string {
    const cleaned = raw.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+')) {
      // Strip the + so sub is always digit-only (e.g. 27791234567, 447911123456)
      return cleaned.slice(1);
    }

    if (cleaned.startsWith('0') && cleaned.length === 10) {
      // SA local format: 0XXXXXXXXX → 27XXXXXXXXX
      return '27' + cleaned.slice(1);
    }

    return cleaned;
  }

  private generateSubId(phoneNumber: string): string {
    const segment = this.phoneToSubSegment(phoneNumber);
    return `sms|${segment}`;
  }

  clientCredentialsExchange(oauthTokenDto: OauthTokenDto) {
    const audience = oauthTokenDto.audience ?? 'https://mock.betterid.local';

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      iss: `${this.domain}/`,
      sub: `${oauthTokenDto.client_id}@clients`,
      aud: audience,
      iat: now,
      exp: now + 86400,
      gty: 'client-credentials',
      azp: oauthTokenDto.client_id,
    };

    const accessToken = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      keyid: 'Y7qHEd7zoL6wRQDqMGuL3',
      header: {
        typ: 'JWT',
        alg: 'RS256',
        kid: 'Y7qHEd7zoL6wRQDqMGuL3',
      },
    });

    return {
      access_token: accessToken,
      expires_in: 86400,
      token_type: 'Bearer',
    };
  }

  getJwks() {
    const jwk = pem2jwk(this.publicKey);

    return {
      keys: [
        {
          ...jwk,
          kid: 'Y7qHEd7zoL6wRQDqMGuL3', // Must match the kid used in JWT signing
          alg: 'RS256',
          use: 'sig',
        }
      ],
    };
  }

  getUserInfo(accessToken: string) {
    console.log("getUserInfo");
    try {
      const decoded = jwt.decode(accessToken) as any;
      const sub: string = decoded?.sub ?? '';
      console.log("sub", sub);
      // sub format from verifyPasswordlessCode: 'sms|27791234567' or 'sms|447911123456'
      const phoneNumber = sub.includes('|') ? sub.split('|')[1] : null;
      return {
        sub,
        phone_number: phoneNumber,
      };
    } catch {
      return { sub: null, phone_number: null };
    }
  }
}
