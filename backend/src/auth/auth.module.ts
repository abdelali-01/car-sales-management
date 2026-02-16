import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminsModule } from '../admins/admins.module';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { MailService } from '../common/services/mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AdminsModule, PassportModule.register({ session: true }), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, MailService],
  exports: [AuthService],
})
export class AuthModule { }
