import { Injectable } from "@nestjs/common";
import { CreatePeopleDto } from "../dto/create-people.dto";
import { People } from "generated/prisma/client";

@Injectable()
export abstract class IPeopleRepository {
    abstract create(data: CreatePeopleDto): Promise<People>
    abstract findByEmail(email: string): Promise<People | null>
    abstract findById(id: string): Promise<People | null>
    abstract findAll(): Promise<People[]>
}