import { define } from 'typeorm-seeding';
import { User } from '../user/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

define(User, () => {
  const user = new User();
  user.username = faker.internet.username();
  user.email = faker.internet.email();
  user.password = bcrypt.hashSync('password123', 10);
  user.profileImagePath = faker.image.avatar();
  return user;
});
