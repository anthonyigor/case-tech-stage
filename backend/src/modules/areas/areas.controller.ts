import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateAreaDto } from "./dto/create-area.dto";
import { areaService } from "./services/area.service";
import { ProcessesService } from "../processes/services/processes.service";
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AreasSchema } from "src/schemas/areas.schema";
import { ProcessTreeSchema } from "src/schemas/process.schema";

@ApiTags('areas')
@Controller('areas')
export class AreasController {
    constructor(
        private readonly areaService: areaService,
        private readonly processService: ProcessesService
    ) {}

    @Post()
    @ApiOperation({
        summary: "Criar uma área"
    })
    @ApiOkResponse({ type: AreasSchema })
    @ApiConflictResponse({ description: "Já existe uma área cadastrada com esse nome" })
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
    @ApiOperation({
        summary: "Listar as áreas cadastradas"
    })
    @ApiOkResponse({ isArray: true, type: AreasSchema })
    async getAreas() {
        return await this.areaService.getAll()
    }

    @Get(':id/tree')
    @ApiOperation({
        summary: "Listar árvore de processos de uma área",
        description: "Retorna todos os processos e seus repectivos subprocessos em ordem de posição"
    })
    @ApiOkResponse({ isArray: true, type: ProcessTreeSchema })
    @ApiNotFoundResponse({ description: 'Área não encontrada' })
    async getProcessTreeByArea(
        @Param('id') id: string
    ) {
        return await this.processService.getTreeByArea(id)
    }

}