import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CommonModule } from "src/common/common.module"
import { UserModule } from "src/user/user.module"
import { AuthController } from "./auth.controller"
import { Auth } from "./auth.entity"
import { AuthService } from "./auth.service"
@Module({
    imports: [TypeOrmModule.forFeature([Auth]), CommonModule, UserModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
