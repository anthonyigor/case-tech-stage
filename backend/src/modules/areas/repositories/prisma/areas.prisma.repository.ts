import { Injectable } from "@nestjs/common";
import { IAreasRepository } from "../areas.repository";
import { Area } from "generated/prisma/client";
import { CreateAreaDto } from "../../dto/create-area.dto";
import { PrismaService } from "src/infra/prisma/prisma.service";

@Injectable()
export class AreasRepositoryPrisma implements IAreasRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(dto: CreateAreaDto): Promise<Area> {
        return await this.prisma.area.create({
            data: {
                name: dto.name,
                description: dto.description
            }
        })
    }
    
    async findByName(name: string): Promise<Area | null> {
        return await this.prisma.area.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        })
    }
    
    async getAll(): Promise<Area[]> {
        return await this.prisma.area.findMany()
    }
    
}