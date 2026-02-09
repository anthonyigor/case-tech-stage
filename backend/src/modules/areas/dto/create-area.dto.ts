import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAreaDto {
    @ApiProperty({ example: "Pessoas" })
    @IsString()
    @MaxLength(80)
    name: string

    @ApiPropertyOptional({ example: "Área de gestão de pessoas" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string
}