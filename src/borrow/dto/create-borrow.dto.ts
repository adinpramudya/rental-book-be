import { IsNotEmpty } from 'class-validator';
import { Member } from 'src/member/entities/member.entity';

export class CreateBorrowDto {
  @IsNotEmpty({ message: 'Masukan tanggal mulai' })
  startDate: Date;

  endDate: Date;

  @IsNotEmpty({ message: 'Masukan tanggal seharusnya di kembalikan' })
  realEndDate: Date;

  @IsNotEmpty({ message: 'Masukan status' })
  state: string;

  punish: number;

  @IsNotEmpty({ message: 'Masukan data anggota' })
  member: Member;

  @IsNotEmpty({ message: 'Masukan buku' })
  bookId: number;

  createdBy: string;
}
