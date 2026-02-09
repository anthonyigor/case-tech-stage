import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";

export class UpdateProcessDetailsDto {
    @ApiPropertyOptional({ example: "Recrutamento e seleção" })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @ApiPropertyOptional({ example: "Processo de recrutamento" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiPropertyOptional({ enum: ProcessType, example: "MANUAL" })
    @IsOptional()
    @IsEnum(ProcessType)
    type?: ProcessType

    @ApiPropertyOptional({ enum: ProcessStatus, example: "DRAFT" })
    @IsOptional()
    @IsEnum(ProcessStatus)
    status?: ProcessStatus
}