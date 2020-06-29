import { CallHandler, ExecutionContext, NestInterceptor, LoggerService } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class MyLogger implements LoggerService {
    log(message: string): void;
    error(message: string, trace: string): void;
    warn(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
}
export declare class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
