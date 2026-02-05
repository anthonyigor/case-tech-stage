import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreatePeopleDto } from "./dto/create-people.dto";
import { PeopleService } from "./services/people.service";

@Controller('people')
export class PeopleController {
    constructor(
        private readonly peopleService: PeopleService
    ) {}

    @Post()
    async createPeople(
        @Body() dto: CreatePeopleDto
    ) {
        return await this.peopleService.create(dto)
    }

    @Get()
    async getAllPeople() {
        return await this.peopleService.getAll()
    }

}