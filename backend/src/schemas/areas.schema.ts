import { ApiProperty } from "@nestjs/swagger";

export class AreasSchema {
    @ApiProperty({ example: "Pessoas" })
    name: string;

    @ApiProperty({ example: "..." , nullable: true})
    description: string | null;
}