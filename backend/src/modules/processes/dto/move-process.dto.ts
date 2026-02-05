import { IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class MoveProcessDto {
    @IsOptional()
    @IsUUID()
    parent_id?: string | null  // undefined = não mexe ; null = vira raiz

    @IsInt()
    @Min(0)
    position: number

}