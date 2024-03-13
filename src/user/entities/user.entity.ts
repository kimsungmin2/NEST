import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Music } from '../../music/entities/music.entity';
import { FavoriteMusicGenre } from '../types/genre.type';
import { Role } from '../types/userRole.type';
import { Point } from '../../point/entities/point.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', select: true, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: FavoriteMusicGenre, nullable: false })
  favoriteMusicGenre: FavoriteMusicGenre;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'varchar', select: true, nullable: false })
  Introduce: string;

  @Column({ type: 'varchar', select: true, nullable: false, default: 'local' })
  platform: string;

  @Column({ type: 'int', nullable: false })
  verifiCationCode: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  emailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany((type) => Music, (music) => music.user)
  music: Music[];

  @OneToMany((type) => Point, (point) => point.user)
  point: Point[];

  @OneToMany((type) => Ticket, (ticket) => ticket.user)
  ticket: Ticket[];
}
