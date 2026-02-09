import { Injectable } from "@nestjs/common";
import { IPeopleRepository } from "../people.repository";
import { People } from "generated/prisma/client";
import { CreatePeopleDto } from "../../dto/create-people.dto";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { UpdatePeopleDto } from "../../dto/update-people.dto";

@Injectable()
export class PeoplePrismaRepository implements IPeopleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreatePeopleDto): Promise<People> {
        return await this.prisma.people.create({
            data: {
                name: data.name,
                email: data.email,
                role: data.role ?? undefined,
                ...(data.team_id ? { team_id: data.team_id } : {})
            }
        })
    }
    
    async findByEmail(email: string): Promise<People | null> {
        return await this.prisma.people.findUnique({
            where: { email}
        })
    }
    
    async findById(id: string): Promise<People | null> {
        return await this.prisma.people.findUnique({
            where: { id }
        })
    }
    
    async findAll(): Promise<People[]> {
        return await this.prisma.people.findMany({
            include: { team: true }
        })
    }

    async update(id: string, data: UpdatePeopleDto) {
        await this.prisma.people.update({
            where: { id },
            data
        })
    }

    async deleteById(id: string): Promise<void> {
        await this.prisma.people.delete({
            where: { id }
        })
    }

}