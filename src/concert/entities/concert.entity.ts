import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { Seat } from '../../seat/entities/seat.entity';
import { ConcertSchedule } from './concertSchedule.entity';

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  concertName: string;

  @Column({ type: 'text', nullable: false })
  concertDescription: string;

  @Column({ type: 'varchar', nullable: false })
  reservationStart: string;

  @Column({ type: 'varchar', nullable: false })
  reservationEnd: string;

  @Column({ type: 'varchar', nullable: false })
  concertStarts: string;

  @Column({ type: 'varchar', nullable: false })
  concertAddress: string;

  @Column({ type: 'varchar', nullable: false })
  concertImage: string;

  @OneToMany(() => ConcertSchedule, (concertSchedule) => concertSchedule.concert)
  concertSchedule: ConcertSchedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
