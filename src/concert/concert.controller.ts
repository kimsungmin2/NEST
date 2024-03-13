import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../utils/guard/roles.guard';
import { Roles } from '../utils/decorator/roles.decorator';
import { Role } from '../user/types/userRole.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@ApiTags('concert')
@UseGuards(RolesGuard)
@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}
  private readonly configService: ConfigService;

  @ApiConsumes('multipart/form-data')
  @Roles(Role.admin)
  @ApiOperation({ summary: '콘서트 개최' })
  @UseInterceptors(FileInterceptor('concertImage'))
  @Post('')
  async createConcert(@Body() createConcertDto: CreateConcertDto, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    console.log(createConcertDto);

    const concert = await this.concertService.createConcert(
      createConcertDto.concertName,
      createConcertDto.concertDescription,
      createConcertDto.reservationStart,
      createConcertDto.reservationEnd,
      createConcertDto.concertStart,
      createConcertDto.concertAddress,
      createConcertDto.grade,
      createConcertDto.price,
      createConcertDto.ea,
      file,
    );
    return concert;
  }

  @ApiOperation({ summary: '콘서트 검색' })
  @Get('search')
  async searchConcert(@Query('search') search: string) {
    console.log(search);
    return await this.concertService.searchConcert(search);
  }
  @ApiOperation({ summary: '콘서트 목록' })
  @Get()
  async allConcertList() {
    return await this.concertService.allConcertList();
  }

  @ApiOperation({ summary: '콘서트 좌석 목록' })
  @Get(':concertId/seat')
  async seatList(@Param('concertId') id: number) {
    return await this.concertService.seatList(id);
  }

  @ApiOperation({ summary: '콘서트 상세 검색' })
  @Get(':concertId')
  async getConcert(@Param('concertId') id: number) {
    return await this.concertService.getConcert(id);
  }
}
