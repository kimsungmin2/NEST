import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '음악 생성' })
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createMusic(@Body() createMusicDto: CreateMusicDto, @Req() req) {
    const user = req.user;
    console.log(user);
    if (user.role < 1) {
      throw new ForbiddenException('가수만 음악 등록이 가능합니다.');
    }
    if (!user) {
      throw new UnauthorizedException('유저가 존재하지 않습니다.');
    }

    const music = await this.musicService.createMusic(
      createMusicDto.title,
      createMusicDto.content,
      createMusicDto.favoriteMusicGenre,
      user.id,
    );
    return music;
  }

  // @Post()
  // create(@Body() createMusicDto: CreateMusicDto) {
  //   return this.musicService.create(createMusicDto);
  // }
  // @ApiOperation({ summary: '음악 조회' })
  // @UseGuards(AuthGuard('jwt'))
  // @Get(':id')
  // findAll() {
  //   return this.musicService.findAll();
  // }
  // @ApiOperation({ summary: '음악 생성' })
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.musicService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
  //   return this.musicService.update(+id, updateMusicDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.musicService.remove(+id);
  // }
}
