import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create(createReviewDto);
    return new ApiResponse<Review>(
      201,
      'Review has been created successfully',
      new Date(),
      await this.reviewRepository.save(review),
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
      const queryBuilder = this.reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.book', 'book')
        .orderBy(`borrow.${sortBy}`, direction)
        .take(take)
        .skip(skip);

      if (search) {
        queryBuilder.where('book.title ILIKE :search ', {
          search: `%${search}%`,
        });
      }
      const [data, totalData] = await queryBuilder.getManyAndCount();
      return new ApiResponse<Review[]>(
        200,
        'Data Review berhasil ditemukan',
        new Date(),
        data,
        {
          page,
          limit: size,
          totalPage: Math.ceil(totalData / size),
          totalData,
        },
      );
    } catch (error) {
      throw new Error('An error occurred while retrieving reviews');
    }
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id: id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return new ApiResponse<Review>(
      200,
      'Review has been fetched',
      new Date(),
      review,
    );
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const existingReview = this.reviewRepository.findOne({ where: { id: id } });
    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    await this.reviewRepository.update(id, updateReviewDto);
    const review = await this.reviewRepository.findOne({ where: { id: id } });
    return new ApiResponse<Review>(
      200,
      'Review has been updated',
      new Date(),
      review,
    );
  }

  async remove(id: number) {
    const existingReview = await this.reviewRepository.findOne({
      where: { id: id },
    });
    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return new ApiResponse<Review>(
      200,
      'Review has been deleted successfully',
      new Date(),
      await this.reviewRepository.remove(existingReview),
    );
  }
}
