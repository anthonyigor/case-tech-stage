import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AddOwnerDto {
    @ApiProperty({ format: "uuid", example: "62bac53d-69b9-45e7-9c81-801ea54a5390" })
    @IsUUID()
    people_id: string
}