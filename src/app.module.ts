import { MiddlewareConsumer, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthMiddleware } from "./auth/auth.middleware"
import { AuthModule } from "./auth/auth.module"
import { CommonModule } from "./common/common.module"
import { TodoController } from "./todo/todo.controller"
import { TodoModule } from "./todo/todo.module"
import { UserModule } from "./user/user.module"

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env.local", ".env"],
            expandVariables: true,
            validate: (config) => ({
                MYSQL_HOST: config.MYSQL_HOST,
                MYSQL_PORT: config.MYSQL_PORT,
                MYSQL_USERNAME: config.MYSQL_USERNAME,
                MYSQL_ROOT_PASSWORD: config.MYSQL_ROOT_PASSWORD,
                MYSQL_DB: config.MYSQL_DB,
                JWT_SECRET: config.JWT_SECRET,
            }),
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DB,
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            autoLoadEntities: true,
            synchronize: true,
        }),
        TodoModule,
        UserModule,
        CommonModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(TodoController)
    }
}
