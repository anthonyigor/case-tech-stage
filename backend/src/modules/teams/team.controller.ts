import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TeamService } from "./services/team.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";

@Controller('teams')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post()
    async create(
        @Body() data: CreateTeamDto
    ) {
        return await this.teamService.create(data);
    }
    
    @Get()
    async findAll() {
        return await this.teamService.findAll();
    }

    @Patch(':id')
    async updateTeam(
        @Param('id') id: string,
        @Body() dto: UpdateTeamDto
    ) {
        return await this.teamService.update(id, dto)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.teamService.delete(id);
    }
}