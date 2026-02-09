import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdatePeopleDto {
    @ApiPropertyOptional({ example: "João Silva" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string

    @ApiPropertyOptional({ example: "joao@stage.com" })
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiPropertyOptional({ example: "HR Partner" })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    role?: string
}