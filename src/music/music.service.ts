import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from './entities/music.entity';
import { Repository } from 'typeorm';
import { FavoriteMusicGenre } from '../user/types/genre.type';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
  ) {}

  async createMusic(title: string, content: string, genre: FavoriteMusicGenre, userId: number) {
    console.log(userId);
    await this.musicRepository.save({
      title,
      content,
      genre,
      userId,
    });
  }
}
// const singer = await this.findById(id);
// if (singer.Role === 'user') {
//   throw new ConflictException('가수만 음악을 등롱할 수 있습니다.');
// }
