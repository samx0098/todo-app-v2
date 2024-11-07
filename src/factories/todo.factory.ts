import { faker } from "@faker-js/faker"
import { define } from "typeorm-seeding"
import { Todo } from "../todo/todo.entity"

define(Todo, () => {
    const todo = new Todo()
    todo.title = faker.lorem.sentence()
    todo.completed = faker.datatype.boolean()
    return todo
})
