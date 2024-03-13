import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, NotFoundException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TicketInterceptor } from '../utils/interceptors/ticket.interceptor';
import { JwtAuthGuard } from 'src/utils/guard/jwt.guard';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiOperation({ summary: '티켓 예매' })
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTicket(@Body() createTicketDto: CreateTicketDto, @Req() req) {
    const user = req.user;
    console.log(user);
    const ticket = await this.ticketService.createTicket(createTicketDto.concertScheduleId, createTicketDto.seatIds, user.id);
    return ticket;
  }

  // @ApiOperation({ summary: '티켓 확인' })
  // @UseGuards(AuthGuard('jwt'))
  // @Get(':ticketId')
  // async getTicket(@Req() req, @Param('ticketId') id: number) {
  //   const user = req.user;

  //   return await this.ticketService.getTicket(id, user.id);
  // }

  @ApiOperation({ summary: '티켓 확인' })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TicketInterceptor)
  @Get('')
  getTicket(@Req() req) {
    console.log(req.user);
    console.log(req.ticket);
    return { 티켓정보: req.ticket };
  }

  @ApiOperation({ summary: '티켓 취소' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':ticketcancel')
  async updateTicket(@Req() req, @Body() updateTicketDto: UpdateTicketDto) {
    const user = req.user;

    await this.ticketService.updateTicket(updateTicketDto.ticketId, user.id);

    return {
      statusCode: 200,
      message: '티켓 예매가 취소되었습니다.',
    };
  }
}
