import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository, UpdateResult } from "typeorm"
import { Todo } from "./todo.entity"

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) {}

    // + create a new todo
    async create(title: string): Promise<Todo> {
        const newTodo = this.todoRepository.create({ title })
        return await this.todoRepository.save(newTodo)
    }

    // + get all todos
    async findAll(
        page: number = 1,
        limit: number = 20,
        sort: string = "id",
        order: "ASC" | "DESC" = "DESC",
        searchText: string = "",
    ): Promise<{ items: Todo[]; totalCount: number }> {
        const skip = (page - 1) * limit
        const [items, totalCount] = await this.todoRepository.findAndCount({
            where: [{ title: Like(`%${searchText}%`) }, { deletedAt: null }],
            order: { [sort]: order },
            skip,
            take: limit,
            relations: ["user"],
            select: {
                user: { id: true, username: true, email: true },
            },
        })
        return { items, totalCount }
    }

    // + get todo by id
    async find(id: number): Promise<Todo> {
        return await this.todoRepository.findOneBy({ id })
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
    async updateTodo(id: number, data: Partial<Todo>): Promise<Todo> {
        try {
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
    async remove(id: number): Promise<UpdateResult> {
        return await this.todoRepository.softDelete({ id })
    }

    // + restore todo by id
    async restore(id: number): Promise<UpdateResult> {
        return await this.todoRepository.restore(id)
    }
}
