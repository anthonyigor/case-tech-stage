import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreatePeopleDto {
    @IsString()
    @MaxLength(80)
    name: string

    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    @MaxLength(50)
    role?: string

    @IsOptional()
    @IsUUID()
    team_id?: string
}