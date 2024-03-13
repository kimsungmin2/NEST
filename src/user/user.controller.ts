import { UserInfo } from '../utils/decorator/userInfo.decorator';
import { Body, Controller, Get, Post, Patch, Req, Res, UseGuards, Param, HttpCode } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { SignUpDto } from './dto/sign.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/guard/jwt.guard';
import { VerifiCation } from './dto/verification.dto';
// import { UpdateDto } from './dto/update.dto';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('sign-up')
  async register(@Body() signUpdto: SignUpDto) {
    const user = await this.userService.signUp(
      signUpdto.email,
      signUpdto.password,
      signUpdto.name,
      signUpdto.favoriteMusicGenre,
      signUpdto.Introduce,
      signUpdto.passwordConfirm,
    );
    return user;
  }

  @ApiOperation({ summary: '회원가입 이메일 인증' })
  @Patch('signup/verifiCation')
  async verifiCationEmail(@Body() verifiCation: VerifiCation) {
    const user = await this.userService.verifiCationEmail(verifiCation.email, verifiCation.code);
    return user;
  }

  @ApiOperation({ summary: '가수 회원가입' })
  @Post('singer/sign-up')
  async singerSignUp(@Body() signUpdto: SignUpDto) {
    const user = await this.userService.singerSignUp(
      signUpdto.email,
      signUpdto.password,
      signUpdto.name,
      signUpdto.favoriteMusicGenre,
      signUpdto.Introduce,
    );
    return user;
  }

  @ApiOperation({ summary: '운영자 회원가입' })
  @Post('admin/sign-up')
  async adminSignUp(@Body() signUpdto: SignUpDto) {
    const user = await this.userService.adminSignUp(signUpdto.email, signUpdto.password, signUpdto.name);
    return user;
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.userService.login(loginDto.email, loginDto.password);

    res.cookie('authorization', `Bearer ${user.accessToken}`);
    res.cookie('refreshToken', user.refreshToken);
    res.send('로그인에 성공하였습니다.');
  }

  @ApiOperation({ summary: '유저 정보' })
  @UseGuards(JwtAuthGuard)
  @Get('')
  getUser(@UserInfo() user: User) {
    return { 이름: user.name, 자기소개: user.Introduce };
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Res() res) {
    //   req.logOut();
    res.clearCookie('authorization');
    res.clearCookie('refreshToken');
    res.send('로그아웃에 성공하였습니다.');
  }

  @ApiOperation({ summary: '유저 포인트' })
  @UseGuards(JwtAuthGuard)
  @Get('point')
  async getPoint(@Req() req) {
    const user = req.user;
    const point = await this.userService.getPoint(user.id);
    return point;
  }

  //   @ApiOperation({ summary: '회원정보 수정' })
  //   @Patch('update')
  //   async updateUser(@Param('id') id: number, @Body() updateDto: UpdateDto) {
  //     const user = await this.userService.userUpdate(updateDto.favoriteMusicGenre);
  //     return {
  //       statusCode: 200,
  //       message: '회원 정보 수정이 완료되었습니다.',
  //       data: user,
  //     };
  //   }
}
