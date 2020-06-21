import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositiry } from './user.repository';
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'
import { jwtStrategy } from './jwt.strategy';
import * as config from 'config'

const jwtConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([UserRepositiry])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    jwtStrategy
  ],
  exports: [
    jwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
