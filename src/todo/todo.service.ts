import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { AuthService } from "src/auth/auth.service"
import { Like, Repository, UpdateResult } from "typeorm"
import { Todo } from "./todo.entity"

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
        private readonly authService: AuthService,
    ) {}

    // + create a new todo
    async create(auth: string, title: string, description?: string): Promise<Todo> {
        try {
            const token = auth.split(" ")[1]
            const payload = await this.authService.verifyToken(token)
            if (!payload) throw new Error("Unauthorized")
            const newTodo = this.todoRepository.create({
                user: { id: payload.id },
                title,
                description,
            })
            return await this.todoRepository.save(newTodo)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // + get all todos
    async findAll(
        auth: string,
        page: number = 1,
        limit: number = 20,
        sort: string = "id",
        order: "ASC" | "DESC" = "DESC",
        searchText: string = "",
    ): Promise<{ items: Todo[]; totalCount: number }> {
        try {
            const token = auth.split(" ")[1]
            const payload = await this.authService.verifyToken(token)
            if (!payload) throw new Error("Unauthorized")
            const skip = (page - 1) * limit
            const [items, totalCount] = await this.todoRepository.findAndCount({
                where: [
                    { user: { id: payload.id }, title: Like(`%${searchText}%`) },
                    { deletedAt: null },
                ],
                order: { [sort]: order },
                skip,
                take: limit,
                relations: ["user"],
                select: {
                    user: { id: true, username: true, email: true },
                },
            })
            return { items, totalCount }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // + get todo by id
    async find(auth: string, id: number): Promise<Todo> {
        try {
            const token = auth.split(" ")[1]
            const payload = await this.authService.verifyToken(token)
            if (!payload) throw new Error("Unauthorized")
            return await this.todoRepository.findOneBy({ user: { id: payload.id }, id })
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // * change todo status by id
    // async updateStatus(id: number, completed: boolean): Promise<Todo> {
    //   const todo = await this.todoRepository.findOneBy({ id });
    //   if (todo) {
    //     todo.completed = completed;
    //     return await this.todoRepository.save(todo);
    //   }
    //   return Promise.reject(Error('Todo not found'));
    // }

    // + update todo by id
    async updateTodo(auth: string, id: number, data: Partial<Todo>): Promise<Todo> {
        try {
            const token = auth.split(" ")[1]
            const payload = await this.authService.verifyToken(token)
            if (!payload) throw new Error("Unauthorized")
            let todo = await this.todoRepository.findOneBy({ id, deletedAt: null })
            if (todo) {
                todo = { ...todo, ...data }
                return await this.todoRepository.save(todo)
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // + soft delete todo by id
    async remove(auth: string, id: number): Promise<null> {
        try {
            const token = auth.split(" ")[1]
            const payload = await this.authService.verifyToken(token)
            if (!payload) throw new Error("Unauthorized")
            await this.todoRepository.softDelete({ id })
            return Promise.resolve(null)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // + restore todo by id
    async restore(auth: string, id: number): Promise<null> {
        try {
            const token = auth.split(" ")[1]
            const payload = await this.authService.verifyToken(token)
            if (!payload) throw new Error("Unauthorized")
            await this.todoRepository.restore(id)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}
