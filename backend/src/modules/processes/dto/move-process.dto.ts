import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class MoveProcessDto {
    @ApiPropertyOptional({ 
        format: 'uuid', 
        description: 'Undefined = não altera processo pai; Null = Vira processo raiz',
        example: '62bac53d-69b9-45e7-9c81-801ea54a5390' 
    })
    @IsOptional()
    @IsUUID()
    parent_id?: string | null  // undefined = não mexe ; null = vira raiz

    @ApiProperty({ example: 0 })
    @IsInt()
    @Min(0)
    position: number

}