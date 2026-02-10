import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "src/modules/users/repositories/user.repository";
import { LoginDto } from "../dto/login.dto";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private jwt: JwtService
    ) {}

    async login(data: LoginDto) {
        const user = await this.userRepository.findByUsername(data.username.trim())
        if (!user) throw new NotFoundException('Username inválido')

        const ok = await bcrypt.compare(data.password, user.password)
        if (!ok) throw new BadRequestException('Credenciais inválidas')

        const token = await this.jwt.signAsync(
            { sub: user.id, username: user.username, email: user.email },
            { expiresIn: '6h' }
        )

        return {
            access_token: token,
            user: {
                id: user.id,
                username: user.username
            }
        }
    }
}