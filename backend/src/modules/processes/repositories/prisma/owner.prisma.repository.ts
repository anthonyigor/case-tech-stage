import { Injectable } from "@nestjs/common";
import { IOwnerRepository } from "../owner.repository";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { ProcessOwner } from "generated/prisma/client";
import { AddOwnerDto } from "../../dto/add-owner.dto";

@Injectable()
export class OwnerPrismaRepository implements IOwnerRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(process_id: string, data: AddOwnerDto): Promise<ProcessOwner> {
        return await this.prisma.processOwner.create({
            data: {
                people: { connect: { id: data.people_id } },
                process: { connect: { id: process_id } }
            }
        })
    }
    
    async findbyId(id: string): Promise<ProcessOwner | null> {
        return await this.prisma.processOwner.findUnique({
            where: { id }
        })
    }
    
    async findByProcess(process_id: string): Promise<ProcessOwner[]> {
        return await this.prisma.processOwner.findMany({
            where: { process_id }
        })
    }
}