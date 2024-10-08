import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getDate, getTime } from 'src/utils/date';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.ip || req.connection.remoteAddress;
    console.log(
      `${green('[Nest]')} ${green(process.pid)}  ${green('-')} ${getDate()}, ${getTime()}     ${green('LOG')} ${yellow('[DigitalPowerLog]')} ${magenta('[' + method + ']')} ${originalUrl} ${magenta('from')} ${ip}`,
    );

    next();
  }
}

function green(message: any) {
  return `\x1b[32m${message}\x1b[0m`;
}

function yellow(message: any) {
  return `\x1b[33m${message}\x1b[0m`;
}

function magenta(message: any) {
  return `\x1b[35m${message}\x1b[0m`;
}
