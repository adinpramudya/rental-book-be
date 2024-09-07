import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Publisher } from 'src/publisher/entities/publisher.entity';
import { BookStatus } from 'src/enum/BookState';
import { Category } from 'src/category/entities/category.entity';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  title: string;

  @IsOptional()
  author: string;

  @IsOptional()
  publisher: Publisher;

  @IsOptional()
  isbn: string;

  @IsOptional()
  publicationDate: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Hanya menerima input number' })
  stock: number;

  @IsOptional()
  @IsNumber({}, { message: 'Hanya menerima input number' })
  countPage: number;

  @IsOptional()
  language: string;

  @IsOptional()
  @IsEnum(BookStatus, {
    message:
      'Status Buku harus salah satu dari nilai berikut: AVAILABLE, BORROWED ,REPAIR ,LOST ,LOST ,QUARANTINE',
  })
  state: BookStatus;

  coverBook: string;
  description: string;

  @IsOptional()
  category: Category;
}
