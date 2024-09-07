// src/data-source.ts

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Member } from './member/entities/member.entity';
import { Book } from './book/entities/book.entity';
import { Category } from './category/entities/category.entity';
import { Publisher } from './publisher/entities/publisher.entity';

config(); // Load .env file

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: [User, Role, Member, Book, Category, Publisher],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: true, // Disable synchronize for production
  logging: true,
});
