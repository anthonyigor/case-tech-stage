import { IsUUID } from "class-validator";

export class AddOwnerDto {
    @IsUUID()
    people_id: string
}