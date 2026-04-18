import { Auth } from './../../auth/auth.decorator';
import { TimeInterceptor } from './../../time/time.interceptor';
import {
  loginUserRequestValidation,
  LoginUserRequest,
} from './../../model/login.model';
import { ValidationPipe } from './../../validation/validation.pipe';
import { UserRepository } from './../user-repository/user-repository';
import { MailService } from './../mail/mail.service';
import { Connection } from './../connection/connection';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './user.service';
import type { User } from 'generated/prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RoleGuard } from 'src/role/role.guard';

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.logger.info('Create User Controller');
  }

  @Get('/current')
  @UseGuards(new RoleGuard(['admin']))
  getCurrentUser(@Auth() user: User): Record<string, string> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  // @UseFilters(ValidationFilter)
  @Post('login')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(@Query('name') name: string, @Body() request: LoginUserRequest) {
    console.log(name);
    return {
      data: `Hello ${request.username}`,
    };
  }

  @Get('/connection')
  getConnection(): string {
    this.mailService.send();
    this.emailService.send();
    return this.connection.getName();
  }

  @Get('/create')
  create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        {
          code: 400,
          errors: 'First name is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.info(
      `Create user with first name: ${firstName} and last name: ${lastName}`,
    );
    return this.userRepository.save(firstName, lastName);
  }

  @Get('/hello')
  // @UseFilters(ValidationFilter)
  sayHello(@Query('name') name: string): string {
    return this.userService.sayHello(name);
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('set cookie berhasil');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return request.cookies['name'] as string;
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    return { message: 'hallo JSON' };
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): string {
    console.info(id * 10);

    return `ini adalah method get dengan id ${id}`;
  }

  @Post()
  post(): string {
    return 'ini adalah method post';
  }

  @Get('/sample')
  get(): string {
    return 'ini adalah method get';
  }
}
