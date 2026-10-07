import { Module } from '@nestjs/common';
import { TgpService } from './tgp.service';
import { TgpController } from './tgp.controller';
import { DevModule } from '../dev/dev.module';
import { TgpAuthController } from './tgp-auth.controller';

@Module({
  imports: [DevModule],
  controllers: [TgpController, TgpAuthController],
  providers: [TgpService],
})
export class TgpModule { }
