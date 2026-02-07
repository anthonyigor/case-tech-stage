import { Injectable } from "@nestjs/common";
import { Prisma, Process } from "generated/prisma/client";
import { FilteredProcess } from "../types";
import { UpdateProcessStatusDto } from "../dto/update-process-status.dto";
import { UpdateProcessDetailsDto } from "../dto/update-process-details.dto";

@Injectable()
export abstract class IProcessesRepository {
    abstract create(data: Prisma.ProcessCreateInput): Promise<Process>
    abstract findById(id: string): Promise<Process | null>
    abstract findByIdwithDetails(id: string): Promise<any>
    abstract getMaxPosition(params: { area_id: string, parent_id: string | null }): Promise<number | null>
    abstract findManyByArea(area_id: string): Promise<FilteredProcess[]>;
    abstract updateStatusProcess(id: string, data: UpdateProcessStatusDto): Promise<void>
    abstract updateDetails(id: string, data: Partial<UpdateProcessDetailsDto>): Promise<void>
    abstract hasChildren(id: string): Promise<boolean>
    abstract deleteProcess(id: string): Promise<void>
}