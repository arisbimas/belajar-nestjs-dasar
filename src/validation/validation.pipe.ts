import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private zodType: ZodType) {}
  transform(value: any, metadata: ArgumentMetadata) {
    //artinya adalah kita memvalidasi request yang ada di body saja, yang query, param, or custom parameter tidak akan divalidasi
    if (metadata.type === 'body') {
      return this.zodType.parse(value);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    }
  }
}
