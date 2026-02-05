import { Injectable } from "@nestjs/common";
import { Prisma, Process } from "generated/prisma/client";

@Injectable()
export abstract class IProcessesRepository {
    abstract create(data: Prisma.ProcessCreateInput): Promise<Process>
    abstract findById(id: string): Promise<Process | null>
    abstract getMaxPosition(params: { area_id: string, parent_id: string | null }): Promise<number | null>
}