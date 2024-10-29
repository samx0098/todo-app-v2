import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  TableForeignKey,
  ManyToOne,
  JoinTable,
} from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; //stores the todo description

  @Column({ default: false })
  completed: boolean; //stores todo status

  @DeleteDateColumn()
  deletedAt: Date; //stores the delete timestamp

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
