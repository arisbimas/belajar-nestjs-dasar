import z from 'zod';
import { ValidationService } from './../../validation/validation/validation.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private validationService: ValidationService) {}

  sayHello(name: string): string {
    const schema = z.string().min(3).max(100);
    const result = this.validationService.validate(schema, name);
    return `Hello ${result}`;
  }
}
