import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import usersDTO from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    return await this.usersService.getAll();
  }

  @Get('/:id')
  async findById(@Param() params: any) {
    return await this.usersService.getById(params.id);
  }

  @Post()
  async create(@Body() usersDto: usersDTO) {
    return await this.usersService.create(usersDto);
  }

  @Delete(':id')
  async delete(@Param() params: any) {
    return await this.usersService.delete(params.id);
  }
}
