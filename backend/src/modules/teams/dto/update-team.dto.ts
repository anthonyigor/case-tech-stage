import { IsArray, IsOptional, IsString, Max, MaxLength } from "class-validator";

export class UpdateTeamDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    peopleIds?: string[];
}