import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { ToolType } from "generated/prisma/enums";

export class AddToolDto {
    @ApiProperty({ example: "Gupy" })
    @IsString()
    @MaxLength(255)
    name: string

    @ApiProperty({ enum: ToolType, example: "TOOL" })
    @IsOptional()
    @IsEnum(ToolType)
    type?: ToolType

    @ApiPropertyOptional({ format: "url", example: "https://gupy.io" })
    @IsOptional()
    @IsUrl()
    url?: string
    
}