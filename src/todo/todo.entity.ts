import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; //stores todo title

  @Column({ nullable: true })
  description: string; //stores todo description

  @Column({ nullable: true })
  media: string; //stores filepath of media

  @Column({ default: false })
  important: boolean; //stores todo importance

  @Column({ default: false })
  completed: boolean; //stores todo status

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date; //stores the create timestamp

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date; //stores the update timestamp

  @DeleteDateColumn()
  deletedAt: Date; //stores the delete timestamp

  @ManyToOne(() => User, (user) => user.todos)
  user: User; //stores the user who created the todo
}
