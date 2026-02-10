import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../user.repository";
import { User } from "generated/prisma/client";
import { CreateUserDto } from "../../dto/create-user.dto";
import { PrismaService } from "src/infra/prisma/prisma.service";

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDto): Promise<User> {
        return await this.prisma.user.create({
            data
        })
    }
    
    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    
    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { email }
        })
    }
    
    async findByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { username }
        })
    }
    
    updateUser(id: string, data: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    deleteById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}