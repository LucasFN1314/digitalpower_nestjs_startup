import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Model } from '../model/model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export async function ResponseMessage(message: any, data?: any) {
  return {
    message,
    data,
  };
}

export class RepositoryService {
  public repository: Repository<any>;

  constructor(repository: Repository<any>) {
    this.repository = repository;
  }

  async create(dto: any) {
    if (dto?.id) {
      const entry = await this.repository.findOne({ where: { id: dto.id } });
      if (entry) {
        await this.repository.update(dto.id, dto); // <- update explícito
        return await this.repository.findOne({ where: { id: dto.id } });
      }
    }
    return await this.repository.save(dto);
  }

  async findAll(arg?: any) {
    return await this.repository.find(arg);
  }

  async remove(id: number) {
    const temp = await this.repository.findOneBy({ id });
    if (!temp) throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
    await this.repository.delete(id);
    return ResponseMessage('Elemento eliminado');
  }
}

export function generateService(model: Model) {
  @Injectable()
  class Service extends RepositoryService {
    constructor(@InjectRepository(model.schema) repository: Repository<typeof model.schema>, configService: ConfigService) {
      super(repository);
    }
  }

  return Service;
}

export function getService(name: string, model: any) {
  return {
    provide: name,
    useClass: generateService(model),
  };
}
