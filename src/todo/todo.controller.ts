import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { UpdateResult } from 'typeorm';
import { ResponseHandlerService } from 'utils/responseHandler';
import { Response } from 'express';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  //create a new todo
  @Post()
  async create(@Body('title') title: string): Promise<Todo> {
    return await this.todoService.create(title);
  }

  //get all todos
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.todoService.findAll();
      return this.responseHandler.handleResponse(res, {
        status: HttpStatus.OK,
        results: data,
        // revalidate: 3600, // 1-hour cache
      });
    } catch (error) {
      console.error(error);
      return this.responseHandler.handleResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
    }
  }

  //get todo by id
  @Get(':id')
  async find(@Param('id') id: number): Promise<Todo> {
    return await this.todoService.find(id);
  }

  //change todo status by id
  @Patch(':id/status')
  async status(
    @Param('id') id: number,
    @Body('completed') completed: boolean,
  ): Promise<Todo> {
    return await this.todoService.status(id, completed);
  }

  //update todo description by id
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
  ): Promise<Todo> {
    return await this.todoService.update(id, title);
  }

  //soft delete todo by id
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<UpdateResult> {
    return await this.todoService.remove(id);
  }

  //restore todo by id
  @Patch(':id/restore')
  async restore(@Param('id') id: number): Promise<UpdateResult> {
    return await this.todoService.restore(id);
  }
}
