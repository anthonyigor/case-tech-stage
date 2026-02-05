import { Module } from "@nestjs/common";
import { AreasController } from "./areas.controller";
import { CreateAreaService } from "./services/create-area.service";
import { IAreasRepository } from "./repositories/areas.repository";
import { AreasRepositoryPrisma } from "./repositories/prisma/areas-repository.prisma";

@Module({
    controllers: [AreasController],
    providers: [
        CreateAreaService,
        { provide: IAreasRepository, useClass: AreasRepositoryPrisma }
    ]
})
export class AreasModule {}