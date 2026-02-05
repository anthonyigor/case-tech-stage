import { Injectable } from "@nestjs/common";
import { AddOwnerDto } from "../dto/add-owner.dto";
import { ProcessOwner } from "generated/prisma/client";

@Injectable()
export abstract class IOwnerRepository {
    abstract create(process_id: string, data: AddOwnerDto): Promise<ProcessOwner>
    abstract findbyId(id: string): Promise<ProcessOwner | null>
    abstract findByProcess(process_id: string): Promise<ProcessOwner[]>
    abstract deleteByPeopleId(process_id: string, people_id: string): Promise<void>
}