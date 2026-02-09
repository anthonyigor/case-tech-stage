import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreatePeopleDto {
    @ApiProperty({ example: "João Silva" })
    @IsString()
    @MaxLength(80)
    name: string

    @ApiProperty({ example: "joao@stage.com" })
    @IsEmail()
    email: string

    @ApiPropertyOptional({ example: 'HR Partner' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    role?: string

    @ApiProperty({ format: "uuid", example: "62bac53d-69b9-45e7-9c81-801ea54a5390" })
    @IsOptional()
    @IsUUID()
    team_id?: string
}