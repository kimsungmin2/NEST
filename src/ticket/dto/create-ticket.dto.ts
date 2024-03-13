import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @ApiProperty({
    example: 7,
    description: '콘서트 ID',
  })
  @IsNotEmpty({ message: '콘서트 Id를 입력해주세요.' })
  concertScheduleId: number;

  @IsNumber({}, { each: true })
  @ApiProperty({
    example: [110, 111, 112],
    description: '좌석 ID',
  })
  @IsNotEmpty({ message: '좌석 Id를 입력해주세요.' })
  seatIds: string[];
}
