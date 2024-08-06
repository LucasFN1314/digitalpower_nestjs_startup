import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export async function RepositoryAction(
  service: any,
  action: any,
  payload: any,
) {
  return await service.repository?.[action](payload);
}

export async function SaveModel(service: any, dto: any) {
  const entry = service.findAll({ where: { id: dto?.id } });
  if (entry.length > 0) {
    return await service.repository.save(dto);
  }
  const temp = await service.repository.create(dto);
  return await service.repository.save(temp);
}

export async function Delete(service: any, id: number) {
  const temp = await service.repository.findOneBy({ id });
  if (!temp) throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
  return await service.repository.delete(id);
}

export async function ResponseMessage(message: any, data?: any) {
  return {
    message,
    data,
  };
}

@Injectable()
export class RepositoryService {
  async create(dto: any) {
    return await SaveModel(this, dto);
  }

  async findAll(arg?: any) {
    return await RepositoryAction(this, 'find', arg);
  }

  async findOne(id: number) {
    return await RepositoryAction(this, 'findOneBy', { id });
  }

  async findOneBy(fields) {
    return await RepositoryAction(this, 'findOneBy', fields);
  }

  async findSelect(fields: any) {
    return await RepositoryAction(this, 'find', fields);
  }

  async remove(id: number) {
    await Delete(this, id);
    return ResponseMessage('Elemento eliminado');
  }
}
