import { ConflictException, Injectable } from "@nestjs/common";
import { IAreasRepository } from "../repositories/areas.repository";
import { CreateAreaDto } from "../dto/create-area.dto";

@Injectable()
export class areaService {
    constructor(private readonly areasRepository: IAreasRepository) {}

    async create(dto: CreateAreaDto) {
        const name = dto.name.trim()
        const areaExists = await this.areasRepository.findByName(name)
        
        if (areaExists) throw new ConflictException('Já existe uma área cadastrada com esse nome')

        return await this.areasRepository.create(dto)
    }

    async getAll() {
        return await this.areasRepository.getAll()
    }

}