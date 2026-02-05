import { Injectable } from "@nestjs/common";
import { ProcessTool } from "generated/prisma/client";
import { AddToolDto } from "../dto/add-tool.dto";

@Injectable()
export abstract class IToolRepository {
    abstract create(process_id: string, data: AddToolDto): Promise<ProcessTool>
    abstract findById(id: string): Promise<ProcessTool | null>
    abstract findByProcess(process_id: string): Promise<ProcessTool[]>
    abstract deleteById(id: string): Promise<void>
}