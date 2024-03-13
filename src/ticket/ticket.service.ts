import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { DataSource, Repository } from 'typeorm';
import { Point } from '../point/entities/point.entity';
import { Seat } from '../seat/entities/seat.entity';
import { SeatStatus } from '../seat/types/seatstatus.type';
import { Concert } from '../concert/entities/concert.entity';
import { ConcertSchedule } from '../concert/entities/concertSchedule.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private dataSource: DataSource,
  ) {}

  async createTicket(concertScheduleId: number, seatIds: string[], userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { sum } = await queryRunner.manager
        .getRepository(Point)
        .createQueryBuilder('point')
        .select('SUM(point.possession)', 'sum')
        .where('point.userId = :id', { id: userId })
        .getRawOne();

      const delay = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      const concertSchedule = await queryRunner.manager.getRepository(ConcertSchedule).findOneBy({ id: concertScheduleId });
      const concertIdSchedule = concertSchedule.concertId;
      const concertReservation = await queryRunner.manager.getRepository(Concert).findOneBy({ id: concertIdSchedule });
      const localTime = new Date().getTime() + 1000 * 60 * 60 * 9;
      const reservationStartTime = new Date(concertReservation.reservationStart).getTime();
      const reservationEndTime = new Date(concertReservation.reservationEnd).getTime();

      if (localTime < reservationStartTime) {
        throw new ForbiddenException('예약이 가능한 기간이 아닙니다.');
      }

      if (localTime > reservationEndTime) {
        throw new ForbiddenException('예약이 가능한 기간이 지났습니다..');
      }

      const ticketSeatId = [];
      let totalPrice = 0;

      await delay(5000);
      for (const seatId of seatIds) {
        const seat = await queryRunner.manager.getRepository(Seat).findOneBy({ id: Number(seatId) });
        const seatTime = await queryRunner.manager
          .getRepository(Seat)
          .createQueryBuilder('seat')
          .where('seat.Id = :id', { id: seatId })
          .setLock('pessimistic_read')
          .getOne();

        if (seat.seatStatus !== 'Possibility') {
          throw new ForbiddenException('이미 예약된 좌석입니다.');
        }
        // console.log(seatTime);
        await delay(5000);
        if (seat.concertScheduleId !== concertScheduleId) {
          throw new BadRequestException('같은 콘서트에서 구매해주세요.');
        }

        totalPrice += seat.price;

        ticketSeatId.push(seatId);
      }

      if (totalPrice > sum) {
        throw new BadRequestException('보유하신 포인트가 부족합니다.');
      }
      await delay(5000);
      const ticket = await queryRunner.manager.getRepository(Ticket).save({
        concertScheduleId,
        seatId: ticketSeatId.join(','),
        userId,
        concertStart: concertSchedule.concertStart,
        totalPrice,
      });
      await queryRunner.manager.getRepository(Point).save({
        userId: userId,
        possession: -totalPrice,
        history: `${ticket.id}`,
      });

      await queryRunner.manager.getRepository(Seat).update(ticketSeatId, { seatStatus: SeatStatus.Impossibility, ticketId: ticket.id });
      await queryRunner.commitTransaction();
      return ticket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      if (error.name === 'QueryFailedError') {
        throw new ForbiddenException('다른 사용자가 좌석을 구매중입니다.');
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateTicket(ticketId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const ticket = await queryRunner.manager.getMongoRepository(Ticket).findOneBy({ where: { id: ticketId } });
      if (ticket.userId !== userId) {
        throw new ForbiddenException('본인 티켓만 취소 할 수 있습니다.');
      }
      const localTime = new Date().getTime() + 1000 * 60 * 60 * 9;
      const concertStart = new Date(ticket.concertStart).getTime();

      if (localTime + 1000 * 60 * 60 * 3 > concertStart) {
        throw new ForbiddenException('예약 취소 시간이 지났습니다.');
      }
      const seatIds = ticket.seatId.split(',');
      const ticketSeatId = [];

      for (const seatId of seatIds) {
        await queryRunner.manager.getRepository(Seat).findOneBy({ id: Number(seatId) });

        ticketSeatId.push(seatId);
      }

      await queryRunner.manager.getMongoRepository(Point).save({
        userId: userId,
        possession: +ticket.totalPrice,
        history: '취소',
      });

      await queryRunner.manager.getRepository(Seat).update(ticketSeatId, {
        seatStatus: SeatStatus.Possibility,
        ticketId: null,
      });
      await this.ticketRepository.delete(ticketId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getTicket(userId: number) {
    return await this.ticketRepository.find({ where: { userId } });
  }
}
