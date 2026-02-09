import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ProcessStatus } from "generated/prisma/enums";

export class UpdateProcessStatusDto {
    @ApiProperty({ enum: ProcessStatus, example: "ACTIVE" })
    @IsEnum(ProcessStatus)
    status: ProcessStatus
}