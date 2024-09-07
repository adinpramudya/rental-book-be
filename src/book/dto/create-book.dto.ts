import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { BookStatus } from 'src/enum/BookState';
import { Publisher } from 'src/publisher/entities/publisher.entity';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Judul Buku tidak boleh kosong' })
  title: string;

  @IsNotEmpty({ message: 'Penulis Buku tidak boleh kosong' })
  author: string;

  @IsNotEmpty({ message: 'Penerbit Buku tidak boleh kosong' })
  publisher: Publisher;

  @IsNotEmpty({ message: 'ISBN Buku tidak boleh kosong' })
  isbn: string;

  @IsNotEmpty({ message: 'Tanggal Terbit Buku tidak boleh kosong' })
  publicationDate: Date;

  @IsNotEmpty({ message: 'Stock Buku tidak boleh kosong' })
  @IsNumber({}, { message: 'Hanya menerima input number' })
  stock: number;

  @IsNotEmpty({ message: 'Jumlah halaman Buku tidak boleh kosong' })
  @IsNumber({}, { message: 'Hanya menerima input number' })
  countPage: number;

  @IsNotEmpty({ message: 'Bahasa Buku tidak boleh kosong' })
  language: string;

  @IsNotEmpty({ message: 'Status Buku tidak boleh kosong' })
  @IsEnum(BookStatus, {
    message:
      'Status Buku harus salah satu dari nilai berikut: AVAILABLE, BORROWED ,REPAIR ,LOST ,LOST ,QUARANTINE',
  })
  state: BookStatus;

  coverBook: string;
  description: string;

  @IsNotEmpty({ message: 'Category Buku tidak boleh kosong' })
  category: Category;
}
