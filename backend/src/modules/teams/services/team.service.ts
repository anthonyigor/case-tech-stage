import { ConflictException, Injectable } from "@nestjs/common";
import { ITeamRepository } from "../repositories/team.repository";
import { CreateTeamDto } from "../dto/create-team.dto";

@Injectable()
export class TeamService {
    constructor(private readonly teamRepository: ITeamRepository) {}

    async create(data: CreateTeamDto) {
        const name = data.name.trim();
        const exists = await this.teamRepository.findTeamByName(name)
        if (exists) throw new ConflictException("Já existe um time com esse nome");

        return await this.teamRepository.createTeam(data);
    }

    async findAll() {
        return await this.teamRepository.getTeams()
    }

}