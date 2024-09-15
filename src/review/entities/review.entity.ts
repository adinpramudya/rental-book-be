import { Book } from 'src/book/entities/book.entity';
import { Member } from 'src/member/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'float' })
  rate: number;
  @Column()
  ulasan: string;
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

  @ManyToOne(() => Book, (book) => book.reviews)
  book: Book;

  @ManyToMany(() => Member, (member) => member.reviews)
  member: Member;
}
