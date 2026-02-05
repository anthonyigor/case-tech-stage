import { Body, Controller, Param, Post } from "@nestjs/common";
import { CreateProcessDto } from "./dto/create-process.dto";
import { ProcessesService } from "./services/processes.service";
import { AddToolDto } from "./dto/add-tool.dto";

@Controller('processes')
export class ProcessesController {
    constructor(
        private readonly processesService: ProcessesService
    ) {}

    @Post()
    async createProcess(
        @Body() dto: CreateProcessDto
    ) {
        return await this.processesService.create(dto)
    }

    @Post(':id/tools')
    async addTool(
        @Param('id') id: string,
        @Body() dto: AddToolDto
    ) {
        return await this.processesService.addTool(id, dto)
    }

}