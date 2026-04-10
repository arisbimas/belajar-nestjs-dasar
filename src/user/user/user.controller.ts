import { UserRepository } from './../user-repository/user-repository';
import { MailService } from './../mail/mail.service';
import { Connection } from './../connection/connection';
import {
  Controller,
  Get,
  Header,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './user.service';
import { User } from 'generated/prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
  ) {}

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
    return this.userRepository.save(firstName, lastName);
  }

  @Get('/hello')
  sayHello(@Query('name') name: string): Promise<string> {
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
  getById(@Param('id') id: string): string {
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
