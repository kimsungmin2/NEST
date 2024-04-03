import { Injectable } from '@nestjs/common';
import { Concert } from './entities/concert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { Seat } from '../seat/entities/seat.entity';
import { AwsService } from '../aws/aws.service';
import { ConcertSchedule } from './entities/concertSchedule.entity';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @InjectRepository(ConcertSchedule)
    private concertScheduleRepository: Repository<ConcertSchedule>,
    private dataSource: DataSource,
    private awsService: AwsService,
  ) {}

  async createConcert(
    concertName: string,
    concertDescription: string,
    reservationStart: string,
    reservationEnd: string,
    concertStarts: string,
    concertAddress: string,
    grade: string,
    price: string,
    ea: string,
    file: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const imageName = this.awsService.getUUID();
      const ext = file.originalname.split('.').pop();

      const imageUrl = await this.awsService.imageUploadToS3(`${imageName}.${ext}`, file, ext);
      const concert = await queryRunner.manager.getRepository(Concert).save({
        concertName,
        concertDescription,
        reservationStart,
        reservationEnd,
        concertStarts,
        concertAddress,
        concertImage: imageUrl,
      });
      const arrayTime = concertStarts.split(',').map(String);

      const arrayGrade = grade.split(',').map(String);

      const arrayEa = ea.split(',').map(Number);

      const arrayPrice = price.split(',').map(Number);

      for (const concertStartTime of arrayTime) {
        const concertSchedule = await queryRunner.manager.getRepository(ConcertSchedule).save({
          concertId: concert.id,
          concertStart: concertStartTime,
        });

        for (let i = 0; i < arrayGrade.length; i++) {
          for (let j = 0; j < arrayEa[i]; j++) {
            let number = j + 1;

            let seat = new Seat();
            seat.grade = arrayGrade[i];
            seat.price = +arrayPrice[i];
            seat.concertScheduleId = concertSchedule.id;
            seat.seatNumber = arrayGrade[i] + '-' + number;
            console.log(seat);
            await queryRunner.manager.getRepository(Seat).save(seat);
          }
        }
      }
      await queryRunner.commitTransaction();
      return concert;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async searchConcert(search: string) {
    console.log(search);
    const searchResult = await this.concertRepository.find({
      where: { concertName: Like(`%${search}%`) },
    });
    console.log(searchResult);
    return searchResult;
  }

  async seatList(concertScheduleId: number) {
    const findAllSeat = await this.seatRepository.find({
      where: {
        concertScheduleId,
      },
      select: {
        seatNumber: true,
        grade: true,
        price: true,
        seatStatus: true,
      },
    });

    return findAllSeat;
  }

  async allConcertList() {
    const findConcert = await this.concertRepository.find({
      select: {
        concertName: true,
        concertDescription: true,
        reservationStart: true,
        reservationEnd: true,
        concertAddress: true,
        concertImage: true,
      },
    });
    return findConcert;
  }
  async getConcert(id: number) {
    const concert = await this.concertRepository.findOne({
      where: { id },
      select: {
        concertName: true,
        concertDescription: true,
        reservationStart: true,
        reservationEnd: true,
        concertAddress: true,
        concertImage: true,
      },
    });
    return concert;
  }
}
