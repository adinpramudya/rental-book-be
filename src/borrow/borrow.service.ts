import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrow } from './entities/borrow.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepository: Repository<Borrow>,
  ) {}
  async create(createBorrowDto: CreateBorrowDto) {
    const borrow = this.borrowRepository.create(createBorrowDto);
    return new ApiResponse<Borrow>(
      201,
      'Data borrow berhasil disimpan',
      new Date(),
      await this.borrowRepository.save(borrow),
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
      const take = size;
      const skip = (page - 1) * size;

      const queryBuilder = this.borrowRepository
        .createQueryBuilder('borrow')
        .leftJoinAndSelect('borrow.member', 'member')
        .leftJoinAndSelect('borrow.book', 'book') // Anda perlu mendefinisikan relasi Book dalam entitas Borrow
        .orderBy(`borrow.${sortBy}`, direction)
        .take(take)
        .skip(skip);

      if (search) {
        queryBuilder.where(
          'member.name LIKE :search OR book.title LIKE :search',
          { search: `%${search}%` },
        );
      }

      const [data, totalData] = await queryBuilder.getManyAndCount();

      return new ApiResponse<Borrow[]>(
        200,
        'Data borrow berhasil ditemukan',
        new Date(),
        data,
        {
          page,
          limit: size,
          totalPage: Math.ceil(totalData / size),
          totalData,
        },
      );
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving data borrow',
      );
    }
  }

  async findOne(id: number) {
    const borrow = await this.borrowRepository.findOne({ where: { id: id } });
    if (!borrow) {
      throw new NotFoundException(`Borrow with ID ${id} not found`);
    }
    return new ApiResponse<Borrow>(
      200,
      'Data borrow berhasil ditemukan',
      new Date(),
      borrow,
    );
  }

  async update(id: number, updateBorrowDto: UpdateBorrowDto) {
    const existingBorrow = await this.borrowRepository.findOne({
      where: { id: id },
    });
    if (!existingBorrow) {
      throw new NotFoundException(`Borrow with ID ${id} not found`);
    }
    await this.borrowRepository.update(id, updateBorrowDto);
    const borrow = await this.borrowRepository.findOne({
      where: { id: id },
    });
    return new ApiResponse<Borrow>(
      200,
      'Data borrow berhasil diubah',
      new Date(),
      borrow,
    );
  }

  async remove(id: number) {
    const existingBorrow = await this.borrowRepository.findOne({
      where: { id: id },
    });
    if (!existingBorrow) {
      throw new NotFoundException(`Borrow with ID ${id} not found`);
    }
    return new ApiResponse<Borrow>(
      200,
      'Data borrow berhasil dihapus',
      new Date(),
      await this.borrowRepository.remove(existingBorrow),
    );
  }
}
