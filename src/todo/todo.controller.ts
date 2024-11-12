import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
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
    async create(
        @Headers("authorization") auth: string,
        @Body("title") title: string,
        @Res() res: Response,
        @Body("description") description?: string,
    ) {
        return this.responseHandler.wrap(
            res,
            () => this.todoService.create(auth, title, description),
            {
                successStatus: HttpStatus.CREATED,
                successMessage: "Todo created successfully",
                errorMessage: "Failed to create todo",
            },
        )
    }

    // + get all todos (GET url/todos)
    @Get()
    async findAll(
        @Headers("authorization") auth: string,
        @Query("page") page = 1,
        @Query("limit") limit = 20,
        @Query("sort") sort = "id",
        @Query("order") order: "ASC" | "DESC" = "DESC",
        @Query("searchText") searchText = "",
        @Res() res: Response,
    ) {
        return this.responseHandler.wrap(
            res,
            () => this.todoService.findAll(auth, +page, +limit, sort, order, searchText),
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
    async find(
        @Headers("authorization") auth: string,
        @Param("id") id: number,
        @Res() res: Response,
    ) {
        return this.responseHandler.wrap(
            res,
            async () => {
                const todo = await this.todoService.find(auth, id)
                if (!todo) throw new Error("Todo not found")
                return todo
            },
            { errorMessage: "Failed to fetch todo", errorStatus: HttpStatus.NOT_FOUND },
        )
    }

    // + update todo by id (PATCH url/todos/:id)
    @Patch(":id")
    async update(
        @Headers("authorization") auth: string,
        @Res() res: Response,
        @Param("id") id: number,
        @Body("title") title?: string,
        @Body("description") description?: string,
        @Body("media") media?: string,
        @Body("important") important?: boolean,
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
                if (restore) return this.todoService.restore(auth, id)
                else
                    return this.todoService.updateTodo(auth, id, {
                        title,
                        description,
                        media,
                        important,
                        completed,
                    })
            },
            {
                successMessage: "Todo updated successfully",
                errorMessage: "Failed to update todo",
            },
        )
    }

    // + soft delete todo by id (DELETE url/todos/:id)
    @Delete(":id")
    async remove(
        @Headers("authorization") auth: string,
        @Param("id") id: number,
        @Res() res: Response,
    ) {
        return this.responseHandler.wrap(res, () => this.todoService.remove(auth, id), {
            successMessage: "Todo deleted successfully",
            errorMessage: "Failed to delete todo",
        })
    }
}
