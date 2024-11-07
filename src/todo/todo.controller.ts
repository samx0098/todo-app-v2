import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Res,
} from "@nestjs/common"
import { Response } from "express"
import { ResponseHandlerService } from "utils/response-handler"
import { TodoService } from "./todo.service"

@Controller("todos") // (url/todos)
export class TodoController {
    constructor(
        private readonly todoService: TodoService,
        private readonly responseHandler: ResponseHandlerService,
    ) {}

    // + create a new todo (POST url/todos/create)
    @Post("create")
    async create(@Body("title") title: string, @Res() res: Response) {
        return this.responseHandler.wrap(res, () => this.todoService.create(title), {
            successStatus: HttpStatus.CREATED,
            successMessage: "Todo created successfully",
            errorMessage: "Failed to create todo",
        })
    }

    // + get all todos (GET url/todos)
    @Get()
    async findAll(
        @Query("page") page = 1,
        @Query("limit") limit = 20,
        @Query("sort") sort = "id",
        @Query("order") order: "ASC" | "DESC" = "DESC",
        @Query("searchText") searchText = "",
        @Res() res: Response,
    ) {
        return this.responseHandler.wrap(
            res,
            () => this.todoService.findAll(+page, +limit, sort, order, searchText),
            {
                errorMessage: "Failed to fetch all todos",
                pagination: {
                    currentPage: +page,
                    pageSize: +limit,
                },
            },
        )
    }

    // + get todo by id (GET url/todos/:id)
    @Get(":id")
    async find(@Param("id") id: number, @Res() res: Response) {
        return this.responseHandler.wrap(
            res,
            async () => {
                const todo = await this.todoService.find(id)
                if (!todo) throw new Error("Todo not found")
                return todo
            },
            { errorMessage: "Failed to fetch todo" },
        )
    }

    // + update todo by id (PATCH url/todos/:id)
    @Patch(":id")
    async update(
        @Res() res: Response,
        @Param("id") id: number,
        @Body("title") title?: string,
        @Body("completed") completed?: boolean,
        @Body("restore") restore?: boolean,
    ) {
        // * Parameter constricting *
        // const option = [title, completed, restore].filter(
        //   (param) => param !== undefined,
        // );

        // if (option.length !== 1) {
        //   return this.responseHandler.wrap(
        //     res,
        //     () => Promise.reject(Error('Invalid request')),
        //     {
        //       errorStatus: HttpStatus.BAD_REQUEST,
        //       errorMessage: 'Only one parameter is allowed',
        //     },
        //   );
        // }

        return this.responseHandler.wrap(
            res,
            () => {
                if (restore) return this.todoService.restore(id)
                return this.todoService.updateTodo(id, { title, completed })
            },
            {
                successMessage: "Todo updated successfully",
                errorMessage: "Failed to update todo",
            },
        )
    }

    // + soft delete todo by id (DELETE url/todos/:id)
    @Delete(":id")
    async remove(@Param("id") id: number, @Res() res: Response) {
        return this.responseHandler.wrap(res, () => this.todoService.remove(id), {
            successMessage: "Todo deleted successfully",
            errorMessage: "Failed to delete todo",
        })
    }
}
