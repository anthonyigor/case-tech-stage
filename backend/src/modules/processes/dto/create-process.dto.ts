import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";

export class CreateProcessDto {
    @IsUUID()
    area_id: string

    @IsOptional()
    @IsUUID()
    parent_id?: string

    @IsString()
    @MaxLength(200)
    title: string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string

    @IsOptional()
    @IsEnum(ProcessType)
    type?: ProcessType

    @IsOptional()
    @IsEnum(ProcessStatus)
    status?: ProcessStatus

    @IsOptional()
    @IsInt()
    @Min(0)
    position?: number
    
}