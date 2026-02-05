import { Module } from "@nestjs/common";
import { ProcessesController } from "./processes.controller";
import { ProcessesService } from "./services/processes.service";
import { IProcessesRepository } from "./repositories/processes.repository";
import { ProcessesPrismaRepository } from "./repositories/prisma/processes.prisma.repository";
import { IAreasRepository } from "../areas/repositories/areas.repository";
import { AreasRepositoryPrisma } from "../areas/repositories/prisma/areas.prisma.repository";
import { IToolRepository } from "./repositories/tool.repository";
import { ToolPrismaRepository } from "./repositories/prisma/tool.prisma.repository";
import { IDocsRepository } from "./repositories/docs.repository";
import { DocsPrismaRepository } from "./repositories/prisma/docs.prisma.repository";

@Module({
    exports: [ProcessesService],
    controllers: [ProcessesController],
    providers: [
        ProcessesService,
        { provide: IProcessesRepository, useClass: ProcessesPrismaRepository },
        { provide: IAreasRepository, useClass: AreasRepositoryPrisma },
        { provide: IToolRepository, useClass: ToolPrismaRepository },
        { provide: IDocsRepository, useClass: DocsPrismaRepository }
    ]  
})
export class ProcessesModule {}