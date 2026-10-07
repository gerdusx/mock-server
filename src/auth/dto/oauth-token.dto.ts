export class OauthTokenDto {
  grant_type: string;
  client_id: string;
  client_secret?: string;
  username?: string; // phone number (passwordless only)
  otp?: string; // (passwordless only)
  realm?: string; // connection name (passwordless only)
  audience?: string;
  scope?: string;
  permissions?: string[];
}