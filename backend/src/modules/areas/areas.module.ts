import { Module } from "@nestjs/common";
import { AreasController } from "./areas.controller";
import { IAreasRepository } from "./repositories/areas.repository";
import { AreasRepositoryPrisma } from "./repositories/prisma/areas.prisma.repository";
import { areaService } from "./services/area.service";

@Module({
    controllers: [AreasController],
    providers: [
        areaService,
        { provide: IAreasRepository, useClass: AreasRepositoryPrisma }
    ]
})
export class AreasModule {}