import { IsEnum, IsNotEmpty } from 'class-validator';
import { Borrow } from 'src/borrow/entities/borrow.entity';
import { TransactionType } from 'src/enum/TrasanctionType';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Jenis Transaksi tidak boleh kosong' })
  @IsEnum(TransactionType, {
    message: 'Jenis Transaksi haruslah BORROWING, RETURNING, atau EXTENDING',
  })
  transactionType: TransactionType;

  amount: number;
  @IsNotEmpty({ message: 'Masukan data peminjaman' })
  borrow: Borrow;

  createdBy: string;
}
