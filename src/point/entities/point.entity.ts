import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Entity({
  name: 'point',
})
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', select: false, nullable: false })
  possession: number;

  @Column({ type: 'varchar', select: false, nullable: false })
  history: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int', { name: 'userId', select: true, nullable: false })
  userId: number;

  @Column('int', { name: 'ticketId', select: false, nullable: true })
  ticketId: number | null;

  @ManyToOne(() => User, (user) => user.point)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.point)
  @JoinColumn([{ name: 'ticketId', referencedColumnName: 'id' }])
  ticket: Ticket;
}
