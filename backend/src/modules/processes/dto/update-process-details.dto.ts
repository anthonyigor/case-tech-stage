import { IsEnum, IsOptional, IsString, Max, MaxLength } from "class-validator";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";

export class UpdateProcessDetailsDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsEnum(ProcessType)
    type?: ProcessType

    @IsOptional()
    @IsEnum(ProcessStatus)
    status?: ProcessStatus
}