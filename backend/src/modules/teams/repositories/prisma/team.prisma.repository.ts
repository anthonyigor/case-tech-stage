import { Injectable } from "@nestjs/common";
import { ITeamRepository } from "../team.repository";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { People, Team } from "generated/prisma/client";
import { CreateTeamDto } from "../../dto/create-team.dto";
import { UpdateTeamDto } from "../../dto/update-team.dto";

@Injectable()
export class TeamPrismaRepository implements ITeamRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async createTeam(data: CreateTeamDto): Promise<Team> {
        return await this.prisma.team.create({
            data: {
                name: data.name.trim(),
                description: data.description?.trim() || null,
                people: { connect: data.peopleIds?.map(id => ({ id })) }
            },
            include: { people: true }
        })
    }

    async findTeamById(team_id: string): Promise<Team & { people: People[] } > {
        return await this.prisma.team.findUnique({
            where: { id: team_id },
            include: { people: true }
        })
    }

    async findTeamByName(name: string): Promise<Team & { people: People[] } > {
        return await this.prisma.team.findFirst({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            include: { people: true }
        })
    }

    async getTeams(): Promise<Team[]> {
        return await this.prisma.team.findMany({
            include: { people: true }
        })
    }

    async updateTeam(team_id: string, data: UpdateTeamDto): Promise<void> {
        await this.prisma.team.update({
            where: { id: team_id },
            data: {
                name: data.name?.trim(),
                description: data.description?.trim(),
                people: data.peopleIds ? {
                    set: data.peopleIds.map(id => ({ id }))
                } : undefined
            }
        })
    }
    
    async deleteTeam(team_id: string): Promise<void> {
        await this.prisma.team.delete({
            where: { id: team_id },
        })
    }

    
}