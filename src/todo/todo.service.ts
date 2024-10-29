import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  //create a new todo
  async create(title: string): Promise<Todo> {
    const newTodo = this.todoRepository.create({ title });
    return await this.todoRepository.save(newTodo);
  }

  //get all todos
  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  //get todo by id
  async find(id: number): Promise<Todo> {
    return await this.todoRepository.findOneBy({ id });
  }

  //change todo status by id
  async status(id: number, completed: boolean): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (todo) {
      todo.completed = completed;
      return await this.todoRepository.save(todo);
    }
    return null;
  }

  //update todo description by id
  async update(id: number, title: string): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (todo) {
      todo.title = title;
      return await this.todoRepository.save(todo);
    }
    return null;
  }

  //soft delete todo by id
  async remove(id: number): Promise<UpdateResult> {
    return await this.todoRepository.softDelete({ id });
  }

  //restore todo by id
  async restore(id: number): Promise<UpdateResult> {
    return await this.todoRepository.restore(id);
  }
}
