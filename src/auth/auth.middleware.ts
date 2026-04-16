/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from './../prisma/prisma/prisma.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: any, res: any, next: () => void) {
    const username = Number(req.headers['x-username']);
    if (!username) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: username,
      },
    });

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    } else {
      req.user = user;
      next();
    }
  }
}
