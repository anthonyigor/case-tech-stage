import { IsString, IsUrl, MaxLength } from "class-validator";

export class AddDocDto {
    @IsString()
    @MaxLength(200)
    title: string
    
    @IsUrl()
    url: string
}