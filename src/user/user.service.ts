import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { DataSource, Repository } from 'typeorm';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './types/userRole.type';
import { FavoriteMusicGenre } from './types/genre.type';
import { Point } from '../point/entities/point.entity';
import { EmailService } from 'src/email/email.service';
import { PointService } from 'src/point/point.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
    private emailService: EmailService,
    private pointService: PointService,
  ) {}

  async signUp(
    email: string,
    password: string,
    name: string,
    favoriteMusicGenre: FavoriteMusicGenre,
    Introduce: string,
    passwordConfirm: string,
  ) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }
    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 체크비밀번호와 일치하지 않습니다.');
    }

    const code = Math.floor(Math.random() * 900000) + 100000;
    await this.emailService.sendVerificationToEmail(email, code);
    const hashedPassword = await hash(password, 10);
    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      favoriteMusicGenre,
      Introduce,
      verifiCationCode: code,
    });

    return user;
  }

  async verifiCationEmail(email: string, code: number) {
    const user = await this.findByEmail(email);

    if (user.verifiCationCode !== code) {
      throw new ConflictException('인증 코드가 일치하지 않습니다.');
    }
    await this.userRepository.update(user.id, {
      emailVerified: true,
    });
    await this.pointService.signUpAddPoint(user.id);
  }

  async singerSignUp(email: string, password: string, name: string, favoriteMusicGenre: FavoriteMusicGenre, Introduce: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      favoriteMusicGenre,
      Introduce,
      role: Role.Singer,
    });
  }

  async createProviderUser(email: string, nickName: string, provider: string) {
    if (provider === 'kakao') {
      const user = await this.userRepository.save({
        email,
        name: nickName,
        platform: 'kakao',
      });
      await this.pointService.signUpAddPoint(user.id);

      return user;
    } else {
      const user = await this.userRepository.save({
        email,
        name: nickName,
        platform: 'naver',
      });

      await this.pointService.signUpAddPoint(user.id);

      return user;
    }
  }

  async adminSignUp(email: string, password: string, name: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      role: Role.admin,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'emailVerified'],
      where: { email },
    });
    if (user.emailVerified === false) {
      throw new UnauthorizedException('아직 인증이 되지 않은 회원입니다.');
    }
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '12h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
  async getPoint(userId: number) {
    const { sum } = await this.dataSource
      .getRepository(Point)
      .createQueryBuilder('point')
      .select('SUM(point.possession)', 'sum')
      .where('point.userId = :id', { id: userId })
      .getRawOne();
    return sum;
  }
}
