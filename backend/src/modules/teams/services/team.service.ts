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

    async delete(id: string) {
        const team = await this.teamRepository.findTeamById(id);
        if (!team) throw new ConflictException("Time não encontrado");

        if (team.people.length > 0) throw new ConflictException("Não é possível deletar um time que possui pessoas associadas");

        await this.teamRepository.deleteTeam(id);
        return {
            ok: true
        }
    }

}