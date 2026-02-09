import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";

export class CreateProcessDto {
    @ApiProperty({ format: "uuid", example: "62bac53d-69b9-45e7-9c81-801ea54a5390" })
    @IsUUID()
    area_id: string

    @ApiPropertyOptional({ example: "62bac53d-69b9-45e7-9c81-801ea54a5390" })
    @IsOptional()
    @IsUUID()
    parent_id?: string

    @ApiProperty({ example: "Recrutamento e seleção" })
    @IsString()
    @MaxLength(200)
    title: string

    @ApiPropertyOptional({ example: "Processo de recrutamento" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string

    @ApiPropertyOptional({ enum: ProcessType, example: "MANUAL" })
    @IsOptional()
    @IsEnum(ProcessType)
    type?: ProcessType

    @ApiPropertyOptional({ enum: ProcessStatus, example: "DRAFT" })
    @IsOptional()
    @IsEnum(ProcessStatus)
    status?: ProcessStatus

    @ApiProperty({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    position?: number
    
}