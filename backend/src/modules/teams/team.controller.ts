import { Body, Controller, Post } from "@nestjs/common";
import { TeamService } from "./services/team.service";
import { CreateTeamDto } from "./dto/create-team.dto";

@Controller('teams')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post()
    async create(
        @Body() data: CreateTeamDto
    ) {
        return await this.teamService.create(data);
    }
}