import { Body, Controller, Get, Post, BadRequestException, Res, Req, UnauthorizedException,NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { ApiBadRequestResponse, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './user.entity';

@ApiTags('Authentication')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService
  ) {}

  @ApiOperation({ summary: 'User Registration' })
  @ApiCreatedResponse({ description: 'User successfully registered' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
  })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ) {
    const { name, email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 12);

    return this.appService.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    type: LoginDto,
    description: 'User login data',
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = loginDto;
    const user = await this.appService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      message: 'Success',
    };
  }

  @ApiOperation({ summary: 'Get User Details' })
  @ApiCookieAuth('jwt')
  @ApiOkResponse({ description: 'User details returned' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verify(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.appService.findOne({ id: data['id'] });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear JWT cookie' })
  @ApiCookieAuth()
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success'
    };
  }
}