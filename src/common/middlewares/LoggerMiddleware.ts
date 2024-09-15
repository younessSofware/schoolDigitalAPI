import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    constructor(@Inject('winston') private readonly logger: Logger){
    }

    use(req: Request, res: Response, next: NextFunction) {
        const request = JSON.stringify(req.body)
        this.logger.info(req.ip + ' - - ['+ new Date() + '] ' + '"' + req.method + ' ' + req.baseUrl + ' ' + req.httpVersion + 
        '" ' + res.statusCode + ' - - request' + request);
        next();
    }
}
