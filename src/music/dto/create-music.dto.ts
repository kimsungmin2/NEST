import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FavoriteMusicGenre } from 'src/user/types/genre.type';

export class CreateMusicDto {
  @IsString()
  @ApiProperty({
    example: '잊어야 한다는 마음으로',
    description: '음악 제목',
  })
  @IsNotEmpty({ message: '음악 제목을 입력해주세요.' })
  title: string;

  @IsString()
  @ApiProperty({
    example: '김광석이 1992년에 발매한 노래',
    description: '음악 내용',
  })
  @IsNotEmpty({ message: '음악 설명을 입력해주세요.' })
  content: string;

  @IsEnum(FavoriteMusicGenre)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Indie',
    description: '음악의 장르(Pop,Rock,Jazz,Ballad,HipHop,Indie)',
  })
  @IsNotEmpty({ message: '음악의 장르를 입력해주세요.' })
  favoriteMusicGenre: FavoriteMusicGenre;
}
