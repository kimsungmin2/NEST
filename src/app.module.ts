import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { MusicModule } from './music/music.module';
import { ConcertModule } from './concert/concert.module';
import { Music } from './music/entities/music.entity';
import { PointModule } from './point/point.module';
import { TicketModule } from './ticket/ticket.module';
import { SeatModule } from './seat/seat.module';
import { Point } from './point/entities/point.entity';
import { Seat } from './seat/entities/seat.entity';
import { Concert } from './concert/entities/concert.entity';
import { Ticket } from './ticket/entities/ticket.entity';
import { CommonModule } from './common/common.module';
import { AwsModule } from './aws/aws.module';
import { ConcertSchedule } from './concert/entities/concertSchedule.entity';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, Music, Point, Seat, Concert, Ticket, ConcertSchedule],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    MusicModule,
    ConcertModule,
    PointModule,
    TicketModule,
    SeatModule,
    CommonModule,
    AwsModule,
    EmailModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
