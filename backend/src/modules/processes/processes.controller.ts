import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateProcessDto } from "./dto/create-process.dto";
import { ProcessesService } from "./services/processes.service";
import { AddToolDto } from "./dto/add-tool.dto";
import { AddDocDto } from "./dto/add-doc.dto";
import { AddOwnerDto } from "./dto/add-owner.dto";
import { MoveProcessDto } from "./dto/move-process.dto";
import { UpdateProcessStatusDto } from "./dto/update-process-status.dto";

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

    @Get(':id')
    async getProcess(
        @Param('id') id: string
    ) {
        return await this.processesService.getById(id)
    }

    @Patch(':id/move')
    async moveProcess(
        @Param('id') id: string,
        @Body() dto: MoveProcessDto
    ) {
        return await this.processesService.moveProcess(id, dto)
    }

    @Patch(':id/status')
    async updateStatusProcess(
        @Param('id') id: string,
        @Body() dto: UpdateProcessStatusDto
    ) {
        return await this.processesService.updateStatus(id, dto)
    }

    @Delete(':id')
    async deleteProcess(
        @Param('id') id: string
    ) {
        return await this.processesService.deleteProcess(id)
    }

    // ----- TOOLS, OWNERS E DOCS -----
    @Post(':id/tools')
    async addTool(
        @Param('id') id: string,
        @Body() dto: AddToolDto
    ) {
        return await this.processesService.addTool(id, dto)
    }

    @Delete(':id/tools/:toolId')
    async removeTool(
        @Param('id') id: string,
        @Param('toolId') tool_id: string
    ) {
        return await this.processesService.removeTool(id, tool_id)
    }

    @Post(':id/docs')
    async addDoc(
        @Param('id') id: string,
        @Body() dto: AddDocDto
    ) {
        return await this.processesService.addDoc(id, dto)
    }

    @Delete(':id/docs/:docId')
    async removeDoc(
        @Param('id') id: string,
        @Param('docId') doc_id: string
    ) {
        return await this.processesService.removeDoc(id, doc_id)
    }

    @Post(':id/owners')
    async addOwner(
        @Param('id') id: string,
        @Body() dto: AddOwnerDto
    ){
        return await this.processesService.addOwner(id, dto)
    }

    @Delete(':id/owners/:peopleId')
    async removeOwner(
        @Param('id') id: string,
        @Param('peopleId') people_id: string
    ) {
        return await this.processesService.removeOwnerByPeople(id, people_id)
    }

}