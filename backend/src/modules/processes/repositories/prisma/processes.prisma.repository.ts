import { Injectable } from "@nestjs/common";
import { IProcessesRepository } from "../processes.repository";
import { Process } from "generated/prisma/client";
import { ProcessCreateInput } from "generated/prisma/models";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { FilteredProcess } from "../../types";

@Injectable()
export class ProcessesPrismaRepository implements IProcessesRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(data: ProcessCreateInput): Promise<Process> {
        return await this.prisma.process.create({
            data
        })
    }
    
    async findById(id: string): Promise<Process | null> {
        return this.prisma.process.findUnique({ where: { id } });
    }
    
    async findManyByArea(area_id: string): Promise<FilteredProcess[]> {
        return await this.prisma.process.findMany({
            where: { area_id },
            orderBy: [{ parent_id: 'asc'}, {position: 'asc'}, {created_at: 'asc'}],
            omit: { created_at: true, updated_at: true, area_id: true }
        })
    }
    
    async getMaxPosition(params: { area_id: string; parent_id: string | null; }): Promise<number | null> {
        const res = await this.prisma.process.aggregate({
            where: { 
                area_id: params.area_id,
                parent_id: params.parent_id ?? null },
                _max: { position: true },
            });

            return res._max.position ?? null;
        }

}