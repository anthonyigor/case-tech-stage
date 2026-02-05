import { Body, Controller, Post } from "@nestjs/common";
import { CreateProcessDto } from "./dto/create-process.dto";
import { ProcessesService } from "./services/processes.service";

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

}