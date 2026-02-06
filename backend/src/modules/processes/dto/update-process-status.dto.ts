import { IsEnum } from "class-validator";
import { ProcessStatus } from "generated/prisma/enums";

export class UpdateProcessStatusDto {
    @IsEnum(ProcessStatus)
    status: ProcessStatus
}