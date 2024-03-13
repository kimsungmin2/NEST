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
import { Point } from '../../point/entities/point.entity';
import { User } from '../../user/entities/user.entity';
import { Seat } from '../../seat/entities/seat.entity';
import { ConcertSchedule } from '../../concert/entities/concertSchedule.entity';

@Entity({
  name: 'tickets',
})
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  concertStart: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'totalPrice', nullable: false })
  totalPrice: number;

  @Column('int', { name: 'userId', nullable: false })
  userId: number;

  @Column('int', { name: 'concertScheduleId', nullable: false })
  concertScheduleId: number;

  @Column('varchar', { name: 'seatId', nullable: false })
  seatId: string;

  @ManyToOne(() => User, (user) => user.ticket)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => ConcertSchedule, (concertSchedule) => concertSchedule.ticket)
  @JoinColumn([{ name: 'concertScheduleId', referencedColumnName: 'id' }])
  concertSchedule: ConcertSchedule;

  @OneToMany(() => Seat, (seat) => seat.ticket)
  seat: Seat[];

  @OneToMany((type) => Point, (point) => point.ticket)
  point: Point[];
}
