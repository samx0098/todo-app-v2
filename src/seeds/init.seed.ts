import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Todo } from '../todo/todo.entity';
import { User } from '../user/user.entity';

export default class Init implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    // Truncate tables
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('TRUNCATE TABLE todos');
    await dataSource.query('TRUNCATE TABLE users');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    //Seed users
    const users = await factory(User)().createMany(5); // Creates 5 users

    //Seed todos and associate them with users
    for (const user of users) {
      await factory(Todo)()
        .map(async (todo: Todo) => {
          todo.user = user; //Associate each todo with a user
          return todo;
        })
        .createMany(10); //Creates 10 todos for each user
    }
  }
}
