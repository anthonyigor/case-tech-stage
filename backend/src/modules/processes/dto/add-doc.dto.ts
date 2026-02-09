import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl, MaxLength } from "class-validator";

export class AddDocDto {
    @ApiProperty({ example: "Política da empresa" })
    @IsString()
    @MaxLength(200)
    title: string
    
    @ApiProperty({ format: "url", example: "https://stage.consulting.com/files/politica.pdf" })
    @IsUrl()
    url: string
}