import { Book } from 'src/book/entities/book.entity';
import { Member } from 'src/member/entities/member.entity';

export class CreateReviewDto {
  rate: number;
  ulasan: string;
  member: Member;
  book: Book;
  createdBy: string;
}
