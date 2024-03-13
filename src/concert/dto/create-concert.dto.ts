import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Grade } from '../../seat/types/grade.type';
import { Transform } from 'class-transformer';

export class CreateConcertDto {
  @IsString()
  @ApiProperty({
    example: '2024 뷰티풀 민트 라이프',
    description: '콘서트 이름',
  })
  @IsNotEmpty({ message: '콘서트 이름을 입력해주세요.' })
  concertName: string;

  @IsString()
  @ApiProperty({
    example: '인디 가수들이 한자리에 모여서 펼치는 페스티벌',
    description: '콘서트 내용',
  })
  @IsNotEmpty({ message: '콘서트 설명을 입력해주세요.' })
  concertDescription: string;

  @IsString()
  @ApiProperty({
    example: '2024-03-07T20:00:00',
    description: '예약 시작',
  })
  @IsNotEmpty({ message: '예약 시작 날짜를 입력해주세요' })
  reservationStart: string;

  @IsString()
  @ApiProperty({
    example: '2024-03-08T20:00:00',
    description: '예약 마감',
  })
  @IsNotEmpty({ message: '예약 마감 날짜를 입력해주세요' })
  reservationEnd: string;

  @ApiProperty({
    example: ['2024-03-11T20:00:00', '2024-03-12T20:00:00', '2024-03-11T20:00:00'],
    description: '콘서트 시작',
    type: 'array',
  })
  @IsNotEmpty({ message: '콘서트의 시작 날을 입력해주세요' })
  concertStart: string;

  @IsString()
  @ApiProperty({
    example: '아산 청소년 문화센터',
    description: '콘서트장 주소',
  })
  @IsNotEmpty({ message: '콘서트장 주소를 알려주세요.' })
  concertAddress: string;

  @IsString({
    each: true,
  })
  @ApiProperty({ type: 'file' })
  @IsOptional()
  concertImage: string;

  @IsString({ each: true })
  @ApiProperty({
    example: [Grade.C, Grade.B],
    description: '좌석 등급',
    type: 'array',
  })
  @IsNotEmpty({ message: '좌석 등급을 기입해주세요.' })
  grade: string;

  @ApiProperty({
    example: [20000, 30000],
    description: '좌석 등급별 가격',
    type: 'array',
  })
  @IsNotEmpty({ message: '등급별 가격을 입력해주세요.' })
  price: string;

  @ApiProperty({
    example: [20, 20],
    description: '티켓 갯수',
    type: 'array',
  })
  @IsNotEmpty({ message: '티켓 갯수를 입력해주세요' })
  ea: string;
}
