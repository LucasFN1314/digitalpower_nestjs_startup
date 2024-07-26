import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import usersDTO from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.usersRepository.find();
  }

  async getById(id: number) {
    return await this.usersRepository.findBy({ id });
  }

  async create(usersDto: usersDTO) {
    const user = await this.usersRepository.create(usersDto);
    return this.usersRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.usersRepository.delete(id);
    return { message: 'User deleted' };
  }
}
