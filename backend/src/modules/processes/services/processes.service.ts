import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { IProcessesRepository } from "../repositories/processes.repository";
import { CreateProcessDto } from "../dto/create-process.dto";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";
import { IAreasRepository } from "src/modules/areas/repositories/areas.repository";
import { FilteredProcess } from "../types";
import { AddToolDto } from "../dto/add-tool.dto";
import { IToolRepository } from "../repositories/tool.repository";
import { IDocsRepository } from "../repositories/docs.repository";
import { AddDocDto } from "../dto/add-doc.dto";
import { PeopleService } from "src/modules/people/services/people.service";
import { AddOwnerDto } from "../dto/add-owner.dto";
import { IOwnerRepository } from "../repositories/owner.repository";
import { Prisma } from "generated/prisma/client";


type ProcessTreeNode = FilteredProcess & { children: ProcessTreeNode[] };

@Injectable()
export class ProcessesService {
    constructor(
        private readonly processesRepository: IProcessesRepository,
        private readonly areaRepository: IAreasRepository,
        private readonly toolRepository: IToolRepository,
        private readonly docsRepository: IDocsRepository,
        private readonly peopleService: PeopleService,
        private readonly ownerRepository: IOwnerRepository
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

    async addTool(process_id: string, dto: AddToolDto) {
        const process = await this.processesRepository.findById(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')
        const newTool = await this.toolRepository.create(process_id, dto)
        return newTool
    }

    async removeTool(process_id: string, tool_id: string) {
        const tool = await this.toolRepository.findById(tool_id)
        if (!tool) throw new NotFoundException('Tool não encontrada')

        if (tool.process_id !== process_id) throw new BadRequestException('A tool informada não pertence a esse processo')

        await this.toolRepository.deleteById(tool_id)

        return {
            ok: true
        }
    }

    async addDoc(process_id: string, dto: AddDocDto) {
        const process = await this.processesRepository.findById(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')

        const newDoc = await this.docsRepository.create(process_id, dto)
        return newDoc
    }

    async removeDoc(process_id: string, doc_id: string) {
        const doc = await this.docsRepository.findById(doc_id)
        if (!doc) throw new NotFoundException('Documento não encontrado')

        if (doc.process_id !== process_id) throw new BadRequestException('O documento informado não pertence a esse processo')

        await this.docsRepository.deleteById(doc_id)

        return {
            ok: true
        }
    }

    async addOwner(process_id: string, dto: AddOwnerDto) {
        const process = await this.processesRepository.findById(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')

        const person = await this.peopleService.findById(dto.people_id)
        if (!person) throw new BadRequestException('Pessoa não encontrada')

        try {
            return await this.ownerRepository.create(process_id, dto);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new ConflictException('Essa pessoa já é responsável por esse processo');
            }
            throw e;
        }
        
    }

    async removeOwnerByPeople(process_id: string, people_id: string) {
        const process = await this.processesRepository.findByIdwithDetails(process_id);
        if (!process) throw new NotFoundException('Processo não encontrado');

        const people = await this.peopleService.findById(people_id);
        if (!people) throw new NotFoundException('Responsável não encontrado');

        await this.ownerRepository.deleteByPeopleId(process_id, people_id);

        return { ok: true };
    }

}