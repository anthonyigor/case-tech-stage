import { Injectable } from "@nestjs/common";
import { IToolRepository } from "../tool.repository";
import { ProcessTool } from "generated/prisma/client";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { AddToolDto } from "../../dto/add-tool.dto";

@Injectable()
export class ToolPrismaRepository implements IToolRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(process_id: string, data: AddToolDto): Promise<ProcessTool> {
        return await this.prisma.processTool.create({
            data: {
                name: data.name,
                type: data.type ?? 'TOOL',
                url: data.url,
                process: { connect: { id: process_id } }
            }
        })
    }

    async findById(id: string): Promise<ProcessTool | null> {
        return await this.prisma.processTool.findUnique({
            where: { id }
        })
    }

    async findByProcess(process_id: string): Promise<ProcessTool[]> {
        return await this.prisma.processTool.findMany({
            where: {
                process_id
            }
        })
    }
    
    async deleteById(id: string): Promise<void> {
        await this.prisma.processTool.delete({
            where: { id }
        })
    }
    
}