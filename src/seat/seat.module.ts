import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { ConcertSchedule } from 'src/concert/entities/concertSchedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, ConcertSchedule])],
  controllers: [],
  providers: [],
})
export class SeatModule {}
