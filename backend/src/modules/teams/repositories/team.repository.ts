import { Injectable } from "@nestjs/common";
import { CreateTeamDto } from "../dto/create-team.dto";
import { Team } from "generated/prisma/client";
import { People } from "generated/prisma/browser";

@Injectable()
export abstract class ITeamRepository {
    abstract createTeam(data: CreateTeamDto): Promise<Team>
    abstract findTeamById(team_id: string): Promise<Team & { people: People[] }>
    abstract findTeamByName(name: string): Promise<Team & { people: People[] }>
    abstract getTeams(): Promise<Team[]>
    abstract updateTeam(team_id: string, data: any): Promise<void>
    abstract deleteTeam(team_id: string): Promise<void>
}