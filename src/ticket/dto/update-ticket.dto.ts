import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '티켓 ID',
  })
  @IsNotEmpty({ message: '티켓 Id를 입력해주세요.' })
  ticketId: number;

  @IsString()
  @ApiProperty({
    example: '취소하겠습니다',
    description: '취소 확인',
  })
  @IsNotEmpty({ message: '좌석 Id를 입력해주세요.' })
  cancel: string;
}
