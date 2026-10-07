import { Module } from '@nestjs/common';
import { TgpModule } from './tgp/tgp.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DevModule } from './dev/dev.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TgpModule,
    AuthModule,
    DevModule,
  ],
})
export class AppModule {}
