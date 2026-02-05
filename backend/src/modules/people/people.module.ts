import { Module } from "@nestjs/common";
import { PeopleController } from "./people.controller";
import { PeopleService } from "./services/people.service";
import { IPeopleRepository } from "./repositories/people.repository";
import { PeoplePrismaRepository } from "./repositories/prisma/people.prisma.repository";

@Module({
    controllers: [PeopleController],
    providers: [
        PeopleService,
        { provide: IPeopleRepository, useClass: PeoplePrismaRepository }
    ]
})
export class PeopleModule {}