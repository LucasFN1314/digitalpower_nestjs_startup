import { HttpException, HttpStatus } from "@nestjs/common";

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