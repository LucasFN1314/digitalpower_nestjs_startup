import { Body, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { Model } from './model.entity';
import { RepositoryService } from '../repository/repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ModelController {
  public service: RepositoryService;
  public modelDto: any;

  constructor(model: Model) {
    this.modelDto = model.dto;
  }

  @Post('/find')
  async find(@Req() req: any) {
    const body = req.body;
    return await this.service.findAll(body);
  }

  @Post('/save')
  async create(@Body() dto: any) {
    const validated: any = await this.validation(this.modelDto, dto);
    if (validated?.errors) throw new HttpException({ message: validated?.errors }, HttpStatus.BAD_REQUEST);
    return await this.service.create(validated);
  }

  @Post('/delete')
  async delete(@Req() req: any) {
    return await this.service.remove(req.body.id);
  }

  async validation(model: any, dto: any) {
    const instance = plainToClass(model, dto);
    const errors = await validate(instance);
    if (errors.length > 0) {
      const err = [];
      Object.keys(errors[0].constraints).forEach((key) => {
        err.push(errors[0].constraints[key]);
      });
      return { errors: err };
    }
    return instance;
  }

  async uniqueFieldValidation(arg) {
    let result = await this.service.findAll({ where: arg });
    return result.length === 0;
  }
}