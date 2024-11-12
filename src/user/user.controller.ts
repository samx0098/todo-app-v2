import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common"
import { Response } from "express"
import { ResponseHandlerService } from "utils/response-handler"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly responseHandler: ResponseHandlerService,
    ) {}

    // + create a new user (POST url/user/signup)
    @Post("signup")
    async signup(
        @Body("username") username: string,
        @Body("email") email: string,
        @Body("password") password: string,
        @Res() res: Response,
        @Body("profileImagePath") profileImagePath?: string,
    ) {
        return this.responseHandler.wrap(
            res,
            () => this.userService.signup(username, email, password, profileImagePath),
            {
                successStatus: HttpStatus.CREATED,
                successMessage: "User created successfully",
                errorMessage: "Failed to create user",
            },
        )
    }
}
