import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.register({
        signOptions: {
            expiresIn: '24h',
            mutatePayload: true
        }
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
