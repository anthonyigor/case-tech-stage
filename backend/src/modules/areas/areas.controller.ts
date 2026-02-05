import { Body, Controller, Post } from "@nestjs/common";
import { CreateAreaDto } from "./dto/create-area.dto";
import { CreateAreaService } from "./services/create-area.service";

@Controller('areas')
export class AreasController {
    constructor(
        private readonly createAreaService: CreateAreaService
    ) {}

    @Post()
    async createArea(
        @Body() dto: CreateAreaDto
    ) {
        const newArea = await this.createAreaService.execute(dto)
        return {
            ok: true,
            created: newArea
        }
    }

}