import { ConflictException, Injectable } from "@nestjs/common";
import { IUserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async create(data: CreateUserDto) {
        const email = data.email.trim()
        const username = data.username.trim()
        
        const emailExists = await this.userRepository.findByEmail(email)
        if (emailExists) throw new ConflictException('Email já cadastrado')

        const usernameExists = await this.userRepository.findByUsername(username)
        if (usernameExists) throw new ConflictException('Username já existe')

        const hashPass = await bcrypt.hash(data.password, 10)
        
        const newUser = await this.userRepository.create({ ...data, password: hashPass })
        return newUser
    }
}