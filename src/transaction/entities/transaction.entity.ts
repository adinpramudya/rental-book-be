import { Borrow } from 'src/borrow/entities/borrow.entity';
import { TransactionType } from 'src/enum/TrasanctionType';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  @OneToOne(() => Borrow, (borrow) => borrow.transaction)
  @JoinColumn()
  borrow: Borrow;
}
