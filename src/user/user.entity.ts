import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Todo } from "../todo/todo.entity"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ nullable: true })
    profileImagePath: string

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[]
}
