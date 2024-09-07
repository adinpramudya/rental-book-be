import { Category } from 'src/category/entities/category.entity';
import { BookStatus } from 'src/enum/BookState';
import { Publisher } from 'src/publisher/entities/publisher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  isbn: string;

  @Column()
  isbn13: string;

  @Column()
  stock: number;

  @Column()
  publicationDate: Date;

  @Column()
  countPage: number;

  @Column()
  language: string;

  @Column()
  description: string;

  @Column()
  coverBook: string;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.AVAILABLE, // Set default status if needed
  })
  state: BookStatus;

  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  publisher: Publisher;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;
}
