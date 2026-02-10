import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "./decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./services/auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Public()
    @Post('login')
    async login(
        @Body() dto: LoginDto
    ) {
        return await this.authService.login(dto)
    }
}
