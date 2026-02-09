import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateTeamDto {
    @ApiProperty({ example: "RH" })
    @IsString()
    @MaxLength(255)
    name: string

    @ApiPropertyOptional({ example: "Time de Recursos Humanos" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string

    @ApiPropertyOptional({ example: ["62bac53d-69b9-45e7-9c81-801ea54a5390", "62bac53d-69b9-45e7-9c81-801ea54a5391"] })
    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    peopleIds?: string[]
}