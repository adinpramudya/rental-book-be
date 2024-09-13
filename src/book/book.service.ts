import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ILike, Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return new ApiResponse<Book>(
      201,
      'Book has been created',
      new Date(),
      await this.bookRepository.save(book),
    );
  }

  async findAll(query: PageableDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'id',
      direction = 'ASC',
      search,
    } = query;
    try {
      const skip = (page - 1) * size;
      const take = size;
      const whereOptions = search
        ? {
            title: ILike(`%${search}%`),
            author: ILike(`%${search}%`),
            isbn: ILike(`%${search}%`),
            isbn13: ILike(`%${search}%`),
          }
        : {};
      const [books, total] = await this.bookRepository.findAndCount({
        where: whereOptions,
        relations: ['category', 'publisher'],
        order: { [sortBy]: direction },
        skip,
        take,
      });

      return new ApiResponse<Book[]>(
        200,
        'Books has been fetched',
        new Date(),
        books,
        {
          page,
          limit: size,
          totalPage: Math.ceil(total / size),
          totalData: total,
        },
      );
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving users',
      );
    }
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id: id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return new ApiResponse<Book>(
      200,
      'Book has been fetched',
      new Date(),
      book,
    );
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = await this.bookRepository.findOne({
      where: { id: id },
    });
    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await this.bookRepository.update(id, updateBookDto);
    const book = await this.bookRepository.findOne({
      where: { id: id },
    });
    return new ApiResponse<Book>(
      200,
      'Book has been updated',
      new Date(),
      book,
    );
  }

  async remove(id: number) {
    const existingBook = await this.bookRepository.findOne({
      where: { id: id },
    });
    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await this.bookRepository.remove(existingBook);
    return new ApiResponse<Book>(
      200,
      'Successfully removed data',
      new Date(),
      null,
    );
  }
}
