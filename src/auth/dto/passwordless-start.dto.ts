export class PasswordlessStartDto {
    client_id: string;
    client_secret: string;
    connection: string;
    phone_number: string;
    send: string; // 'code' or 'link'
  }