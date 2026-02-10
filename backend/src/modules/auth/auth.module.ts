import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { IUserRepository } from "../users/repositories/user.repository";
import { UserPrismaRepository } from "../users/repositories/prisma/user.prisma.repository";
import 'dotenv/config'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET!,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        { provide: IUserRepository, useClass: UserPrismaRepository }
    ]
})
export class AuthModule {}