import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PeopleSchema {
    @ApiProperty({ example: "João Silva" })
    name: string;

    @ApiProperty({ example: 'joao@stage.com' })
    email: string;

    @ApiPropertyOptional({ example: 'HR Partner' })
    role?: string;

    @ApiPropertyOptional({ format: "uuid", example: "62bac53d-69b9-45e7-9c81-801ea54a5390" })
    team_id?: string
}