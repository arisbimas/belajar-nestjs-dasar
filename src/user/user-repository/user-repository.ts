import { User } from 'generated/prisma/client';
import { PrismaService } from './../../prisma/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {
    console.log('Create User Repository');
  }

  async save(firstName: string, lastName: string): Promise<User> {
    return this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  }
}
