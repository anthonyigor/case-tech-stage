import { Injectable } from "@nestjs/common";
import { Prisma, Process } from "generated/prisma/client";
import { FilteredProcess } from "../types";

@Injectable()
export abstract class IProcessesRepository {
    abstract create(data: Prisma.ProcessCreateInput): Promise<Process>
    abstract findById(id: string): Promise<Process | null>
    abstract findByIdwithDetails(id: string): Promise<any>
    abstract getMaxPosition(params: { area_id: string, parent_id: string | null }): Promise<number | null>
    abstract findManyByArea(area_id: string): Promise<FilteredProcess[]>;
}