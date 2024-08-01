import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export async function RepositoryAction(service: any, action: any, payload: any) {
    return await service.repository?.[action](payload);
}

export async function SaveModel(service: any, dto: any) {
    const temp = await service.repository.create(dto);
    return await service.repository.save(temp);
}

export async function Delete(service: any, id: number) {
    const temp = await service.repository.findOneBy({ id });
    if (!temp) throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
    return await service.repository.delete(id);
}

export async function ResponseMessage(message: any) {
    return {
        message
    }
}

@Injectable()
export class RepositoryService {
    async create(dto: any) {
        return await SaveModel(this, dto);
    }

    async findAll(arg?: any) {
        return await RepositoryAction(this, "find", arg);
    }

    async findOne(id: number) {
        return await RepositoryAction(this, "findOneBy", { id });
    }

    async findSelect(fields: any) {
        return await RepositoryAction(this, "find", fields);
    }

    async update(id: number, dto: any) {

    }

    async remove(id: number) {
        await Delete(this, id);
        return ResponseMessage("Elemento eliminado");
    }
}