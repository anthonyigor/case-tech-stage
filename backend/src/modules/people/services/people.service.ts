import { ConflictException, Injectable } from "@nestjs/common";
import { IPeopleRepository } from "../repositories/people.repository";
import { CreatePeopleDto } from "../dto/create-people.dto";

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

}