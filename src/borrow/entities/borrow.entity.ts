import { Member } from 'src/member/entities/member.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  realEndDate: Date;

  @Column()
  state: string;

  @Column({ nullable: true })
  punish: number;

  @ManyToOne(() => Member, (member) => member.borrows)
  member: Member;

  @Column()
  bookId: number;

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

  @OneToOne(() => Transaction, (transaction) => transaction.borrow)
  transaction: Transaction;
}
