import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const secret = this.configService.get<string>('SECRET_KEY');
    let token = '';
    try {
      token = req.headers.authorization.split(' ')[1];
    } catch (error) {
      throw new HttpException('Token no provisto', HttpStatus.UNAUTHORIZED);
    }

    try {
      req.user = await jwt.verify(token, secret);
    } catch (error) {
      throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
