import { Body, Controller, Headers, HttpStatus, Post, Res } from "@nestjs/common"
import { Response } from "express"
import { ResponseHandlerService } from "utils/response-handler"
import { AuthService } from "./auth.service"

@Controller("auth") // (url/auth)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly responseHandler: ResponseHandlerService,
    ) {}

    // + Login route (POST /auth/login)
    @Post("login")
    async login(
        @Body("email") email: string,
        @Body("password") password: string,
        @Res() res: Response,
    ) {
        return this.responseHandler.wrap(res, () => this.authService.login(email, password), {
            successStatus: HttpStatus.OK,
            successMessage: "Login successful",
            errorStatus: HttpStatus.UNAUTHORIZED,
            errorMessage: "Invalid email or password",
        })
    }

    // + Logout route (POST /auth/logout)
    @Post("logout")
    async logout(@Headers("authorization") token: string, @Res() res: Response) {
        return this.responseHandler.wrap(
            res,
            () => this.authService.invalidateToken(token.split(" ")[1]),
            { successStatus: HttpStatus.OK, successMessage: "Logout successful" },
        )
    }
}
