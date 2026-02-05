import { Injectable } from "@nestjs/common";
import { Area, Prisma } from "generated/prisma/client";

@Injectable()
export abstract class IAreasRepository {
    abstract create(data: Prisma.AreaCreateInput): Promise<Area>
    abstract findByName(name: string): Promise<Area | null>
    abstract findById(id: string): Promise<Area | null>
    abstract getAll(): Promise<Area[]>
}