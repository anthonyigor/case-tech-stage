import { IsEmail, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MaxLength(255)
    username: string

    @IsEmail()
    email: string

    @IsString()
    password: string

}