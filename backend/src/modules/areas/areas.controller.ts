import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateAreaDto } from "./dto/create-area.dto";
import { areaService } from "./services/area.service";

@Controller('areas')
export class AreasController {
    constructor(
        private readonly areaService: areaService
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
}