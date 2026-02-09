import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdatePeopleDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    @MaxLength(50)
    role?: string
}