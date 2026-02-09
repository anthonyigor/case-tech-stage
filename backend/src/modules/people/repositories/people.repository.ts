import { Injectable } from "@nestjs/common";
import { CreatePeopleDto } from "../dto/create-people.dto";
import { People } from "generated/prisma/client";
import { UpdatePeopleDto } from "../dto/update-people.dto";

@Injectable()
export abstract class IPeopleRepository {
    abstract create(data: CreatePeopleDto): Promise<People>
    abstract findByEmail(email: string): Promise<People | null>
    abstract findById(id: string): Promise<People | null>
    abstract findAll(): Promise<People[]>
    abstract update(id: string, data: UpdatePeopleDto): Promise<void>
    abstract deleteById(id: string): Promise<void>
}