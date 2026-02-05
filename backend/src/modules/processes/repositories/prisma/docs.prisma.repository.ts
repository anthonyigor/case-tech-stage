import { Injectable } from "@nestjs/common";
import { IDocsRepository } from "../docs.repository";
import { ProcessDoc } from "generated/prisma/client";
import { AddDocDto } from "../../dto/add-doc.dto";
import { PrismaService } from "src/infra/prisma/prisma.service";

@Injectable()
export class DocsPrismaRepository implements IDocsRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(process_id: string, data: AddDocDto): Promise<ProcessDoc> {
        return await this.prisma.processDoc.create({
            data: {
                title: data.title,
                url: data.url,
                process: { connect: { id: process_id } }
            }
        })
    }

    async findById(id: string): Promise<ProcessDoc | null> {
        return await this.prisma.processDoc.findUnique({
            where: { id }
        })
    }

    async findByProcess(process_id: string): Promise<ProcessDoc[]> {
        return await this.prisma.processDoc.findMany({
            where: {
                process_id
            }
        })
    }

}