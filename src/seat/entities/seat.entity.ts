import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { Grade } from '../types/grade.type';
import { SeatStatus } from '../types/seatstatus.type';
import { ConcertSchedule } from '../../concert/entities/concertSchedule.entity';

@Entity({
  name: 'seat',
})
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', select: true, nullable: false })
  price: number;

  @Column({ type: 'varchar', select: true, nullable: false })
  seatNumber: string;

  @Column({ type: 'enum', enum: SeatStatus, nullable: false })
  seatStatus: SeatStatus; //불리언?

  @Column({ type: 'enum', enum: Grade, nullable: false })
  grade: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'concertScheduleId', nullable: false })
  concertScheduleId: number;

  @Column('int', { name: 'ticketId', nullable: true })
  ticketId: number | null;

  @ManyToOne(() => Ticket, (ticket) => ticket.seat)
  @JoinColumn([{ name: 'ticketId', referencedColumnName: 'id' }])
  ticket: Ticket;

  @ManyToOne(() => ConcertSchedule, (concertSchedule) => concertSchedule.seat)
  @JoinColumn([{ name: 'concertScheduleId', referencedColumnName: 'id' }])
  concertSchedule: ConcertSchedule;
}
