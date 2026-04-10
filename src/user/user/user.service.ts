import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  sayHello(name: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Hello ${name}`);
      }, 1000);
    });
  }
}
