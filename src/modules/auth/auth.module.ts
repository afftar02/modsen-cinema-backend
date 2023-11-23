import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PersonModule } from '../person/person.module';
import { PassportModule } from '@nestjs/passport';
import {
  LocalStrategy,
  JwtStrategy,
  RefreshStrategy,
  GoogleStrategy,
  FacebookStrategy,
  GithubStrategy,
} from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PersonModule,
    PassportModule,
    TokenModule,
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
  ],
})
export class AuthModule {}
