import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreatePeopleDto } from "./dto/create-people.dto";
import { PeopleService } from "./services/people.service";
import { UpdatePeopleDto } from "./dto/update-people.dto";
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PeopleSchema } from "src/schemas/people.schema";

@ApiTags('people')
@Controller('people')
export class PeopleController {
    constructor(
        private readonly peopleService: PeopleService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar uma pessoa' })
    @ApiOkResponse({ type: PeopleSchema })
    @ApiConflictResponse({ description: "Email já cadastrado" })
    async createPeople(
        @Body() dto: CreatePeopleDto
    ) {
        return await this.peopleService.create(dto)
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as pessoas cadastradas' })
    @ApiOkResponse({ isArray: true, type: PeopleSchema })
    async getAllPeople() {
        return await this.peopleService.getAll()
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar dados de uma pessoa' })
    @ApiOkResponse({ example: { ok: true } })
    @ApiBadRequestResponse({ description: "Email informado já está em uso" })
    @ApiNotFoundResponse({ description: "Pessoa não encontrada" })
    async updatePeople(
        @Param("id") id: string,
        @Body() dto: UpdatePeopleDto
    ) {
        return await this.peopleService.update(id, dto)
    }

    @Delete(":id")
    @ApiOperation({ summary: "Remover uma pessoa" })
    @ApiOkResponse({ example: { ok: true } })
    @ApiNotFoundResponse({ description: "Pessoa não encontrada" })
    async deletePeople(
        @Param("id") id: string
    ) {
        return await this.peopleService.deleteById(id)
    }

}