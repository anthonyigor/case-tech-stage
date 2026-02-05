import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IProcessesRepository } from "../repositories/processes.repository";
import { CreateProcessDto } from "../dto/create-process.dto";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";
import { IAreasRepository } from "src/modules/areas/repositories/areas.repository";
import { FilteredProcess } from "../types";


type ProcessTreeNode = FilteredProcess & { children: ProcessTreeNode[] };

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

    async getTreeByArea(area_id: string) {
        // validar area
        const area = await this.areaRepository.findById(area_id)
        if (!area) throw new NotFoundException('Área não encontrada')

        const processes = await this.processesRepository.findManyByArea(area_id)

        // map para montar a árvore de processos
        const byId = new Map<string, ProcessTreeNode>()
        for (const p of processes) {
            byId.set(p.id, {...p, children: []})
        }

        const roots: ProcessTreeNode[] = []

        // adiciona os subprocessos como children do seu processo pai
        for (const node of byId.values()) {
            if (!node.parent_id) {
                roots.push(node)
                continue
            }

            const parent = byId.get(node.parent_id)
            if (parent) {
                parent.children.push(node)
            } else {
                roots.push(node)
            }
        }

        // garantir ordenação dos subprocessos por position
        const sort = (nodes: ProcessTreeNode[]) => {
            nodes.sort((a, b) => a.position - b.position)
            for (const n of nodes) sort(n.children)
        }

        sort(roots)

        return roots
    }

}