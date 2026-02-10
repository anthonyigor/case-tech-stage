import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./services/user.service";
import { IUserRepository } from "./repositories/user.repository";
import { UserPrismaRepository } from "./repositories/prisma/user.prisma.repository";

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        { provide: IUserRepository, useClass: UserPrismaRepository }
    ]
})
export class UserModule {}