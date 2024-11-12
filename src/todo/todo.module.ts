import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CommonModule } from "src/common/common.module"
import { TodoController } from "./todo.controller"
import { Todo } from "./todo.entity"
import { TodoService } from "./todo.service"
import { AuthModule } from "src/auth/auth.module"

@Module({
    imports: [TypeOrmModule.forFeature([Todo]), CommonModule, AuthModule],
    providers: [TodoService],
    controllers: [TodoController],
})
export class TodoModule {}
