import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreatePeopleDto } from "./dto/create-people.dto";
import { PeopleService } from "./services/people.service";
import { UpdatePeopleDto } from "./dto/update-people.dto";

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

    @Patch(':id')
    async updatePeople(
        @Param("id") id: string,
        @Body() dto: UpdatePeopleDto
    ) {
        return await this.peopleService.update(id, dto)
    }

    @Delete(":id")
    async deletePeople(
        @Param("id") id: string
    ) {
        return await this.peopleService.deleteById(id)
    }

}