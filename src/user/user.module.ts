import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Point } from '../point/entities/point.entity';
import { EmailService } from 'src/email/email.service';
import { PointModule } from 'src/point/point.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Point]),
    PointModule,
  ],
  providers: [UserService, EmailService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
