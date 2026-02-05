import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateAreaDto } from "./dto/create-area.dto";
import { areaService } from "./services/area.service";
import { ProcessesService } from "../processes/services/processes.service";

@Controller('areas')
export class AreasController {
    constructor(
        private readonly areaService: areaService,
        private readonly processService: ProcessesService
    ) {}

    @Post()
    async createArea(
        @Body() dto: CreateAreaDto
    ) {
        const newArea = await this.areaService.create(dto)
        return {
            ok: true,
            created: newArea
        }
    }

    @Get()
    async getAreas() {
        return await this.areaService.getAll()
    }

    @Get(':id/tree')
    async getProcessTreeByArea(
        @Param('id') id: string
    ) {
        return await this.processService.getTreeByArea(id)
    }

}