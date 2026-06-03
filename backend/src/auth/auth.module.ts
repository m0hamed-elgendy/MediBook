import {  Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],

      useFactory:(configService:ConfigService)=>({
        secret:configService.get<string>('JWT_SECRET'),
        signOptions:{
          expiresIn:configService.get<string>('JWT_ACCESS_EXPIRES')! as any,


        },
      }),
    }),
     
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
