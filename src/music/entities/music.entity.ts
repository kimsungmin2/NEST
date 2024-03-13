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
import { FavoriteMusicGenre } from '../../user/types/genre.type';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'music',
})
export class Music {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string;

  @Column({ type: 'text', select: false, nullable: false })
  content: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  genre: FavoriteMusicGenre;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'userId', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.music)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}
