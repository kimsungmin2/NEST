import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Point } from '../point/entities/point.entity';
import { JwtService } from '@nestjs/jwt';
import { FavoriteMusicGenre } from './types/genre.type';
import { Role } from './types/userRole.type';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockPointRepository = {
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockDataSource = {
    getRepository: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({ sum: '100' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Point), useValue: mockPointRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('회원가입 테스트', () => {
    const user = {
      id: 5,
      email: 'test@gmail.com',
      password: 'test',
      name: 'test',
      favoriteMusicGenre: FavoriteMusicGenre.Pop,
      introduce: 'test',
      passwordConfirm: 'test',
    };

    beforeEach(() => {
      mockUserRepository.findOneBy.mockReset();
      mockUserRepository.save.mockReset();
      mockPointRepository.save.mockReset();
    });

    it('회원가입 성공', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(user);

      await service.signUp(user.email, user.password, user.name, user.favoriteMusicGenre, user.introduce, user.passwordConfirm);

      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockPointRepository.save).toHaveBeenCalledWith({
        userId: user.id,
        possession: 1000000,
        history: '가입축하',
      });
    });

    it('이메일이 이미 존재하는 경우 예외를 발생시킨다', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(user);

      await expect(
        service.signUp(user.email, user.password, user.name, user.favoriteMusicGenre, user.introduce, user.passwordConfirm),
      ).rejects.toThrow(ConflictException);
    });

    it('비밀번호와 비밀번호 확인이 일치하지 않는 경우 예외를 발생시킨다', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.signUp(user.email, 'password1', user.name, user.favoriteMusicGenre, user.introduce, 'password2'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
  describe('singerSignUp 테스트', () => {
    const user = {
      email: 'test@gmail.com',
      password: 'test',
      name: 'test',
      favoriteMusicGenre: FavoriteMusicGenre.Pop,
      Introduce: 'test',
    };

    it('회원가입 성공', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue({ ...user, role: Role.Singer });

      await service.singerSignUp(user.email, user.password, user.name, user.favoriteMusicGenre, user.Introduce);

      // expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: user.email,
        password: user.password,
        name: user.name,
        favoriteMusicGenre: user.favoriteMusicGenre,
        Introduce: user.Introduce,
        role: Role.Singer,
      });
    });

    it('이메일이 이미 존재하는 경우 예외를 발생시킨다', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await expect(service.singerSignUp(user.email, user.password, user.name, user.favoriteMusicGenre, user.Introduce)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
