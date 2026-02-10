import { Injectable } from "@nestjs/common";
import { User } from "generated/prisma/client";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export abstract class IUserRepository {
    abstract create(data: CreateUserDto): Promise<User>
    abstract findById(id: string): Promise<User | null>
    abstract findByEmail(email: string): Promise<User | null>
    abstract findByUsername(username: string): Promise<User | null>
    abstract updateUser(id: string, data: any): Promise<void>
    abstract deleteById(id: string): Promise<void>
}