import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { ToolType } from "generated/prisma/enums";

export class AddToolDto {
    @IsString()
    @MaxLength(255)
    name: string

    @IsOptional()
    @IsEnum(ToolType)
    type?: ToolType

    @IsOptional()
    @IsUrl()
    url?: string
    
}