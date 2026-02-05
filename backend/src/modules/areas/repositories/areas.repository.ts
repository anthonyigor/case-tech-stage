import { Injectable } from "@nestjs/common";
import { CreateAreaDto } from "../dto/create-area.dto";
import { Area } from "generated/prisma/client";

@Injectable()
export abstract class IAreasRepository {
    abstract create(dto: CreateAreaDto): Promise<Area>
    abstract findByName(name: string): Promise<Area | null>
    abstract getAll(): Promise<Area[]>
}