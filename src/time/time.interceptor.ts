import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        value.timestamp = new Date();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value;
      }),
    );
  }
}
