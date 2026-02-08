import { IsArray, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateTeamDto {
    @IsString()
    @MaxLength(255)
    name: string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    peopleIds?: string[]
}