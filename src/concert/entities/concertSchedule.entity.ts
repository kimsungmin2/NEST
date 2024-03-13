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
import { Concert } from './concert.entity';
import { Seat } from '../../seat/entities/seat.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Entity({
  name: 'concertSchedule',
})
export class ConcertSchedule {
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

  @Column('int', { name: 'concertId', nullable: false })
  concertId: number;

  @ManyToOne(() => Concert, (concert) => concert.concertSchedule)
  @JoinColumn([{ name: 'concertId', referencedColumnName: 'id' }])
  concert: Concert;

  @OneToMany(() => Ticket, (ticket) => ticket.concertSchedule)
  ticket: Ticket[];

  @OneToMany(() => Seat, (seat) => seat.concertSchedule)
  seat: Seat[];
}
