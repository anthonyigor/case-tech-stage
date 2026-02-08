import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { ITeamRepository } from "../repositories/team.repository";
import { CreateTeamDto } from "../dto/create-team.dto";
import { UpdateTeamDto } from "../dto/update-team.dto";
import { IPeopleRepository } from "src/modules/people/repositories/people.repository";

@Injectable()
export class TeamService {
    constructor(
        private readonly teamRepository: ITeamRepository,
        private readonly peopleRepository: IPeopleRepository
    ) {}

    async create(data: CreateTeamDto) {
        const name = data.name.trim();
        const exists = await this.teamRepository.findTeamByName(name)
        if (exists) throw new ConflictException("Já existe um time com esse nome");

        return await this.teamRepository.createTeam(data);
    }

    async findAll() {
        return await this.teamRepository.getTeams()
    }

    async update(id: string, data: UpdateTeamDto) {
        const team = await this.teamRepository.findTeamById(id);
        if (!team) throw new ConflictException("Time não encontrado");

        if (data.name) {
            const name = data.name.trim();
            const exists = await this.teamRepository.findTeamByName(name)
            if (exists && exists.id !== id) throw new ConflictException("Já existe um time com esse nome");
        }

        if (data.peopleIds) {
            const people = await this.peopleRepository.findAll()
            const peopleIds = new Set(Array.from(people.map(p => p.id)))
            let missing = []
            
            for (const people of data.peopleIds) {
                const found = peopleIds.has(people)
                if (!found) missing.push(people)
            }

            if (missing.length > 0) throw new BadRequestException(`O(s) id(s): ${missing.join(', ')} são inválidos`)
        }

        await this.teamRepository.updateTeam(id, data);
        return {
            ok: true
        }
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