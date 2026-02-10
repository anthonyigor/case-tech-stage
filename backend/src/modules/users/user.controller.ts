import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "./services/user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("users")
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(
        @Body() dto: CreateUserDto
    ) {
        return await this.userService.create(dto)
    }
}