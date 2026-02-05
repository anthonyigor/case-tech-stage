import { Module } from "@nestjs/common";
import { ProcessesController } from "./processes.controller";
import { ProcessesService } from "./services/processes.service";
import { IProcessesRepository } from "./repositories/processes.repository";
import { ProcessesPrismaRepository } from "./repositories/prisma/processes.prisma.repository";
import { IAreasRepository } from "../areas/repositories/areas.repository";
import { AreasRepositoryPrisma } from "../areas/repositories/prisma/areas.prisma.repository";

@Module({
    controllers: [ProcessesController],
    providers: [
        ProcessesService,
        { provide: IProcessesRepository, useClass: ProcessesPrismaRepository },
        { provide: IAreasRepository, useClass: AreasRepositoryPrisma }
    ]  
})
export class ProcessesModule {}