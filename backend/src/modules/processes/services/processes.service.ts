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
import { MoveProcessDto } from "../dto/move-process.dto";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { UpdateProcessStatusDto } from "../dto/update-process-status.dto";
import { UpdateProcessDetailsDto } from "../dto/update-process-details.dto";


type ProcessTreeNode = FilteredProcess & { children: ProcessTreeNode[] };

@Injectable()
export class ProcessesService {
    constructor(
        private readonly processesRepository: IProcessesRepository,
        private readonly areaRepository: IAreasRepository,
        private readonly toolRepository: IToolRepository,
        private readonly docsRepository: IDocsRepository,
        private readonly peopleService: PeopleService,
        private readonly ownerRepository: IOwnerRepository,
        private readonly prisma: PrismaService
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

    async getById(process_id: string) {
        const process = await this.processesRepository.findByIdwithDetails(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')

        return process
    }

    async moveProcess(process_id: string, dto: MoveProcessDto) {
        const process = await this.processesRepository.findById(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')

        // parent_id: undefined = não altera pai (só reordenar); null = vira raiz; uuid = mover para esse pai
        const newParentId = dto.parent_id === undefined ? process.parent_id : dto.parent_id

        // se o parente for o mesmo processo, não permitir
        if (newParentId === process.id) throw new BadRequestException('Um processo não pode ser seu próprio processo pai')

        // validar novo pai
        if (newParentId) {
            const parent = await this.processesRepository.findById(newParentId)
            if (!parent) throw new NotFoundException('Processo pai não encontrado')

            if (parent.area_id !== process.area_id) throw new BadRequestException('Processo pai precisa pertencer a mesma área')
            
            // evitar ciclo
            let cursorId: string | null = parent.parent_id
            while(cursorId) {
                if (cursorId === process_id) {
                    throw new BadRequestException('Não é permitir mover um processo para abaixo do seu próprio descendente')
                }

                const cursor = await this.processesRepository.findById(cursorId)
                cursorId = cursor?.parent_id ?? null
            }
        }

        return await this.prisma.$transaction(async (tx) => {
            const areaId = process.area_id
            const oldParentId = process.parent_id
            const targetParentId = newParentId

            // buscar processos filhos do atual processo pai
            const oldLinkedProcesses = await tx.process.findMany({
                where: {
                    area_id: areaId,
                    parent_id: oldParentId
                },
                orderBy: { position: 'asc' },
                select: { id: true, position: true}
            })

            // remover próprio nó da lista
            const oldList = oldLinkedProcesses.filter(p => p.id !== process_id).map(p => p.id)

            // buscar processos filhos do novo processo pai (caso mude)
            let newList: string[]
            if (targetParentId === oldParentId) {
                newList = [...oldList]
            } else {
                const newLinkedProcess = await tx.process.findMany({
                    where: {
                        area_id: areaId,
                        parent_id: newParentId
                    },
                    orderBy: { position: 'asc' },
                    select: { id: true, position: true }
                })
                newList = newLinkedProcess.map(p => p.id)
            }

            // inserir nó na posiçao informada
            const clampedPos = Math.max(0, Math.min(dto.position, newList.length))
            newList.splice(clampedPos, 0, process_id)

            // atualiza o próprio nó
            await tx.process.update({
                where: { id: process_id },
                data: {
                    parent_id: targetParentId,
                    position: clampedPos
                }
            })

            // atualizar posições dos processo filhos do antigo pai (se mudou)
            if (targetParentId !== oldParentId) {
                for (let i = 0; i < oldList.length; i++) {
                    await tx.process.update({
                        where: { id: oldList[i] },
                        data: { position: i }
                    })
                }
            }

            // atualizar posições dos processos filhos do novo pai
            for (let i = 0; i < newList.length; i++) {
                const id = newList[i]
                // evita update redundante do próprio nó 
                if (id === process_id && i === clampedPos) continue

                await tx.process.update({
                    where: { id },
                    data: { position: i }
                })
            }

            // retorna processo atualizado
            return tx.process.findUnique({ where: { id: process_id } })
        })

    }

    async updateStatus(process_id: string, dto: UpdateProcessStatusDto) {
        const process = await this.processesRepository.findById(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')

        // se não for processo root, atualizar apenas ele
        if (process.parent_id) {
            await this.processesRepository.updateStatusProcess(process_id, dto)
            
            return {
                ok: true
            }
        }

        // se for root, aplicar novo status a todos os subprocessos
        const processByArea = await this.processesRepository.findManyByArea(process.area_id)
        const childrenByParent = new Map<string, string[]>()
        for (const p of processByArea) {
            if (!p.parent_id) continue
            const arr = childrenByParent.get(p.parent_id) ?? []
            arr.push(p.id)
            childrenByParent.set(p.parent_id, arr)
        }

        const idsToUpdate: string[] = []
        const stack = [process_id]

        while(stack.length) {
            const current = stack.pop()
            idsToUpdate.push(current)

            const children = childrenByParent.get(current) ?? []
            for (const c of children) stack.push(c)
        }

        // transaction para atualizar o processo/subprocessos filhos
        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.process.updateMany({
                where: { id: { in: idsToUpdate } },
                data: {
                    status: dto.status
                }
            })

            return {
                updatedCount: updated.count
            }
        })

        return {
            ok: true,
            count: result.updatedCount
        } 
        
    }

    async updateDetails(process_id: string, dto: UpdateProcessDetailsDto) {
        const process = await this.processesRepository.findById(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')

        // atualizar status
        if (dto.status) {
            await this.updateStatus(process_id, { status: dto.status })
        }

        // atualizar outros detalhes
        await this.processesRepository.updateDetails(
            process_id, 
            { title: dto.title, description: dto.description, type: dto.type }
        )

    }

    async deleteProcess(process_id: string) {
        const process = await this.processesRepository.findById(process_id)
        if (!process) throw new NotFoundException('Processo não encontrado')

        const hasChildren = await this.processesRepository.hasChildren(process_id)
        if (hasChildren) throw new BadRequestException('Não é possível deletar um processo com subprocessos conectados. Delete ou mova o subprocesso primeiro.')
        
        await this.processesRepository.deleteProcess(process_id)
        return {
            ok: true
        }
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