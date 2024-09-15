import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowDto } from './create-borrow.dto';
import { IsOptional } from 'class-validator';
import { Member } from 'src/member/entities/member.entity';

export class UpdateBorrowDto extends PartialType(CreateBorrowDto) {
  @IsOptional()
  startDate: Date;

  endDate: Date;

  @IsOptional()
  realEndDate: Date;

  @IsOptional()
  state: string;

  punish: number;

  @IsOptional()
  member: Member;

  @IsOptional()
  bookId: number;

  updatedBy: string;
}
