import { BadRequestException, Injectable } from "@nestjs/common";
import { IOwnerRepository } from "../owner.repository";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { Prisma, ProcessOwner } from "generated/prisma/client";
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
    
    async deleteByPeopleId(process_id: string, people_id: string): Promise<void> {
        try {
        await this.prisma.processOwner.delete({
            where: {
                process_owner_process_people_unique: {
                    process_id,
                    people_id,
                },
            },
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
            throw new BadRequestException('A pessoa informada não é responsável por esse processo');
        }
        throw e;
    }
    }
    
}