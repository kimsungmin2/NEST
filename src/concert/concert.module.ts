import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Seat } from '../seat/entities/seat.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from '../utils/factory/multer-options.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsService } from '../aws/aws.service';
import { ConcertSchedule } from './entities/concertSchedule.entity';

@Module({
  imports: [
    // MulterModule.registerAsync({ imports: [ConfigModule], useFactory: multerOptionsFactory, inject: [ConfigService] }),
    TypeOrmModule.forFeature([Concert, Seat, ConcertSchedule]),
  ],
  controllers: [ConcertController],
  providers: [ConcertService, AwsService],
})
export class ConcertModule {}
