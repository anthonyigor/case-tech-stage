import { Injectable } from "@nestjs/common";
import { AddDocDto } from "../dto/add-doc.dto";
import { ProcessDoc } from "generated/prisma/client";

@Injectable()
export abstract class IDocsRepository {
    abstract create(process_id: string, data: AddDocDto): Promise<ProcessDoc>
    abstract findById(id: string): Promise<ProcessDoc | null>
    abstract findByProcess(process_id: string): Promise<ProcessDoc[]>
}