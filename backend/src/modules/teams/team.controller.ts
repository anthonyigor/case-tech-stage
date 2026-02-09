import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TeamService } from "./services/team.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TeamsSchema } from "src/schemas/teams.schema";

@ApiTags('teams')
@Controller('teams')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post()
    @ApiOperation({ summary: "Criar um time" })
    @ApiOkResponse({ type: TeamsSchema })
    @ApiConflictResponse({ description: "Já existe um time com esse nome" })
    async create(
        @Body() data: CreateTeamDto
    ) {
        return await this.teamService.create(data);
    }
    
    @Get()
    @ApiOperation({ summary: "Listar times cadastrados" })
    @ApiOkResponse({ isArray: true, type: TeamsSchema })
    async findAll() {
        return await this.teamService.findAll();
    }

    @Patch(':id')
    @ApiOperation({ summary: "Atualizar dados de um time" })
    @ApiOkResponse({ example: { ok: true } })
    @ApiConflictResponse({ description: "Já existe um time com esse nome" })
    @ApiNotFoundResponse({ description: "Time não encontrado" })
    @ApiBadRequestResponse({ description: "Os ids [...] são inválidos" })
    async updateTeam(
        @Param('id') id: string,
        @Body() dto: UpdateTeamDto
    ) {
        return await this.teamService.update(id, dto)
    }

    @Delete(':id')
    @ApiOperation({ summary: "Remover um time" })
    @ApiOkResponse({ example: { ok: true } })
    @ApiNotFoundResponse({ description: "Time não encontrado" })
    @ApiBadRequestResponse({ description: "Não é possível deletar um time que possui pessoas associadas" })
    async delete(@Param('id') id: string) {
        return await this.teamService.delete(id);
    }
}