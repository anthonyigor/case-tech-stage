import { ApiProperty } from "@nestjs/swagger";

export class TeamsSchema {
    @ApiProperty({ example: "RH" })
    name: string;

    @ApiProperty({ example: "..." , nullable: true})
    description: string | null;
}