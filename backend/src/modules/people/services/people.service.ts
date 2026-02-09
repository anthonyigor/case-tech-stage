import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { IPeopleRepository } from "../repositories/people.repository";
import { CreatePeopleDto } from "../dto/create-people.dto";
import { UpdatePeopleDto } from "../dto/update-people.dto";

@Injectable()
export class PeopleService {
    constructor(private readonly peopleRepository: IPeopleRepository) {}

    async create(dto: CreatePeopleDto) {
        const email = dto.email.trim()
        const exists = await this.peopleRepository.findByEmail(email)
        if (exists) throw new ConflictException('Email já cadastrado')

        const newPerson = await this.peopleRepository.create(dto)
        return newPerson
    }

    async getAll() {
        return await this.peopleRepository.findAll()
    }

    async findById(id: string) {
        return await this.peopleRepository.findById(id)
    }

    async update(id: string, data: UpdatePeopleDto) {
        const person = await this.peopleRepository.findById(id)
        if (!person) throw new NotFoundException('Pessoa não encontrada')

        if (data.email) {
            const email = data.email.trim()
            const emailExists = await this.peopleRepository.findByEmail(email)
            if (emailExists) {
                if (person.id !== emailExists.id) throw new BadRequestException('Email informado já está em uso')
            }
        }

        await this.peopleRepository.update(id, data)
        return {
            ok: true
        }
    }

    async deleteById(id: string) {
        const exists = await this.peopleRepository.findById(id)
        if (!exists) throw new NotFoundException('Pessoa não encontrada')

        await this.peopleRepository.deleteById(id)
        return {
            ok: true
        }
    }

}