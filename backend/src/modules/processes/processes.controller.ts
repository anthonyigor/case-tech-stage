import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateProcessDto } from "./dto/create-process.dto";
import { ProcessesService } from "./services/processes.service";
import { AddToolDto } from "./dto/add-tool.dto";
import { AddDocDto } from "./dto/add-doc.dto";
import { AddOwnerDto } from "./dto/add-owner.dto";
import { MoveProcessDto } from "./dto/move-process.dto";
import { UpdateProcessStatusDto } from "./dto/update-process-status.dto";
import { UpdateProcessDetailsDto } from "./dto/update-process-details.dto";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DocDto, OwnerDto, ProcessSchema, ToolDto } from "src/schemas/process.schema";

@ApiTags('processes')
@Controller('processes')
export class ProcessesController {
    constructor(
        private readonly processesService: ProcessesService
    ) {}

    @Post()
    @ApiOperation({
        summary: "Criar um novo processo",
        description: "Cria um processo na área informada. Se `parent_id` for informado, cria como subprocesso"
    })
    @ApiOkResponse({ type: ProcessSchema })
    @ApiNotFoundResponse({ description: "Área não encontrada" })
    @ApiBadRequestResponse({ description: "Processo pai precisa pertencer a mesma área" })
    async createProcess(
        @Body() dto: CreateProcessDto
    ) {
        return await this.processesService.create(dto)
    }

    @Get(':id')
    @ApiOperation({
        summary: "Detalhar processo",
    })
    @ApiOkResponse({ type: ProcessSchema })
    @ApiNotFoundResponse({ description: "Processo não encontrado" })
    async getProcess(
        @Param('id') id: string
    ) {
        return await this.processesService.getById(id)
    }

    @Patch(':id/details')
    @ApiOperation({ summary: 'Atualizar detalhes de um processo' })
    @ApiOkResponse({ example: { ok: true } })
    @ApiNotFoundResponse({ description: "Processo não encontrado" })
    async updateProcessDetails(
        @Param('id') id: string,
        @Body() dto: UpdateProcessDetailsDto
    ) {
        return await this.processesService.updateDetails(id, dto)
    }

    @Patch(':id/move')
    @ApiOperation({ 
        summary: "Mover/reordenar processo",
        description: "Permite trocar o pai (`parent_id`) e/ou reordenar por `position`. Não permite ciclos nem mover para abaixo do próprio descendente.", 
    })
    @ApiOkResponse({ type: ProcessSchema })
    @ApiNotFoundResponse({ description: 'Processo (ou `parent_id`) não encontrado' })
    @ApiBadRequestResponse({ description: 'Processo movido em ciclo ou não pertence a mesma área do `parent_id` informado' })
    async moveProcess(
        @Param('id') id: string,
        @Body() dto: MoveProcessDto
    ) {
        return await this.processesService.moveProcess(id, dto)
    }

    @Patch(':id/status')
    @ApiOperation({
        summary: "Atualizar apenas status do processo",
        description: "Se for um processo raiz, atualiza em cascata os seus subprocessos com o mesmo `status`"
    })
    @ApiOkResponse({ example: { ok: true, count: 2 } })
    @ApiNotFoundResponse({ description: "Processo não encontrado" })
    async updateStatusProcess(
        @Param('id') id: string,
        @Body() dto: UpdateProcessStatusDto
    ) {
        return await this.processesService.updateStatus(id, dto)
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Remover um processo",
        description: "Se o processo tiver processos-filhos (subprocessos ligados a ele) não será possível remover. Nesse caso os filhos terão de ser movidos ou removidos primeiro"
    })
    @ApiOkResponse({ example: { ok: true } })
    @ApiNotFoundResponse({ description: 'Processo não encontrado' })
    @ApiBadRequestResponse({ description: "Não é possível deletar um processo com subprocessos conectados. Delete ou mova o subprocesso primeiro." })
    async deleteProcess(
        @Param('id') id: string
    ) {
        return await this.processesService.deleteProcess(id)
    }

    // ----- TOOLS, OWNERS E DOCS -----
    @Post(':id/tools')
    @ApiOperation({
        summary: "Adicionar uma ferramenta ao processo"
    })
    @ApiOkResponse({ type: ToolDto })
    @ApiNotFoundResponse({ description: 'Processo não encontrado' })
    async addTool(
        @Param('id') id: string,
        @Body() dto: AddToolDto
    ) {
        return await this.processesService.addTool(id, dto)
    }

    @Delete(':id/tools/:toolId')
    @ApiOperation({
        summary: "Remover uma ferramenta do processo"
    })
    @ApiOkResponse({ example: { ok: true } })
    @ApiBadRequestResponse({ description: "A tool informada não pertence a esse processo" })
    @ApiNotFoundResponse({ description: 'Processo não encontrado' })
    async removeTool(
        @Param('id') id: string,
        @Param('toolId') tool_id: string
    ) {
        return await this.processesService.removeTool(id, tool_id)
    }

    @Post(':id/docs')
    @ApiOperation({
        summary: "Adicionar um documento ao processo"
    })
    @ApiOkResponse({ type: DocDto })
    @ApiNotFoundResponse({ description: 'Processo não encontrado' })
    async addDoc(
        @Param('id') id: string,
        @Body() dto: AddDocDto
    ) {
        return await this.processesService.addDoc(id, dto)
    }

    @Delete(':id/docs/:docId')
    @ApiOperation({
        summary: "Remover um documento do processo"
    })
    @ApiOkResponse({ example: { ok: true } })
    @ApiBadRequestResponse({ description: "O documento informado não pertence a esse processo" })
    @ApiNotFoundResponse({ description: 'Processo não encontrado' })
    async removeDoc(
        @Param('id') id: string,
        @Param('docId') doc_id: string
    ) {
        return await this.processesService.removeDoc(id, doc_id)
    }

    @Post(':id/owners')
     @ApiOperation({
        summary: "Adicionar um responsável ao processo"
    })
    @ApiOkResponse({ type: OwnerDto })
    @ApiNotFoundResponse({ description: 'Processo não encontrado' })
    async addOwner(
        @Param('id') id: string,
        @Body() dto: AddOwnerDto
    ){
        return await this.processesService.addOwner(id, dto)
    }

    @Delete(':id/owners/:peopleId')
     @ApiOperation({
        summary: "Remover um responsável do processo"
    })
    @ApiOkResponse({ example: { ok: true } })
    @ApiBadRequestResponse({ description: "O responsável informado não pertence a esse processo" })
    @ApiNotFoundResponse({ description: 'Processo não encontrado' })
    async removeOwner(
        @Param('id') id: string,
        @Param('peopleId') people_id: string
    ) {
        return await this.processesService.removeOwnerByPeople(id, people_id)
    }

}