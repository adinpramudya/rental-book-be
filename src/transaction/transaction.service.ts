import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return new ApiResponse<Transaction>(
      201,
      'Transaction created successfully',
      new Date(),
      await this.transactionRepository.save(transaction),
    );
  }

  async findAll(query: PageableDto) {
    const {
      page = 1,
      size = 10,
      direction = 'ASC',
      sortBy = 'id',
      search,
    } = query;

    try {
      const take = size;
      const skip = (page - 1) * size;

      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.borrow', 'borrow') // Join dengan Borrow
        .orderBy(`transaction.${sortBy}`, direction)
        .take(take)
        .skip(skip);

      if (search) {
        // Pencarian berdasarkan id borrow
        queryBuilder.where('borrow.id = :borrowId', { borrowId: search });
      }

      const [data, totalData] = await queryBuilder.getManyAndCount();

      return {
        data,
        totalData,
        totalPages: Math.ceil(totalData / size),
        currentPage: page,
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: id },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return new ApiResponse<Transaction>(
      200,
      'Transaction has been fetched',
      new Date(),
      transaction,
    );
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const existingTransaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    await this.transactionRepository.update(id, updateTransactionDto);
    const transaction = await this.transactionRepository.findOne({
      where: { id: id },
    });
    return new ApiResponse<Transaction>(
      200,
      'Transaction has been updated',
      new Date(),
      transaction,
    );
  }

  async remove(id: number) {
    const existingTransaction = await this.transactionRepository.findOne({
      where: { id: id },
    });
    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return new ApiResponse<Transaction>(
      200,
      'Transaction has been removed',
      new Date(),
      await this.transactionRepository.remove(existingTransaction),
    );
  }
}
