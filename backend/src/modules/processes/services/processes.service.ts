import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IProcessesRepository } from "../repositories/processes.repository";
import { CreateProcessDto } from "../dto/create-process.dto";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";
import { IAreasRepository } from "src/modules/areas/repositories/areas.repository";

@Injectable()
export class ProcessesService {
    constructor(
        private readonly processesRepository: IProcessesRepository,
        private readonly areaRepository: IAreasRepository
    ) {}

    async create(dto: CreateProcessDto) {
        // validar existência da área
        const area = await this.areaRepository.findById(dto.area_id)
        if (!area) throw new NotFoundException('Área não encontrada')

        // validações do parent (processo pai) se informado
        if (dto.parent_id) {
            const parent = await this.processesRepository.findById(dto.parent_id)
            if (!parent) throw new NotFoundException('Processo pai não encontrado')

            if (parent.area_id !== dto.area_id) throw new BadRequestException('Processo pai precisa pertencer a mesma área')
        }

        // definir position: se front não informar, definir o ultimo + 1
        const position = dto.position ??
            ((await this.processesRepository.getMaxPosition({
                area_id: dto.area_id,
                parent_id: dto.parent_id
            })) ?? -1 ) + 1

        // criar processo/subprocesso
        return await this.processesRepository.create({
            area: { connect: { id: dto.area_id } },
            parent: dto.parent_id ? { connect: { id: dto.parent_id } } : undefined,
            title: dto.title,
            description: dto.description,
            type: dto.type ?? ProcessType.MANUAL,
            status: dto.status ?? ProcessStatus.DRAFT,
            position
        })
    }

}