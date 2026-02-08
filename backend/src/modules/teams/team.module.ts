import { Module } from "@nestjs/common";
import { TeamController } from "./team.controller";
import { TeamService } from "./services/team.service";
import { ITeamRepository } from "./repositories/team.repository";
import { TeamPrismaRepository } from "./repositories/prisma/team.prisma.repository";
import { IPeopleRepository } from "../people/repositories/people.repository";
import { PeoplePrismaRepository } from "../people/repositories/prisma/people.prisma.repository";

@Module({
    controllers: [TeamController],
    providers: [
        TeamService,
        { provide: ITeamRepository, useClass: TeamPrismaRepository },
        { provide: IPeopleRepository, useClass: PeoplePrismaRepository }
    ]
})
export class TeamModule {}