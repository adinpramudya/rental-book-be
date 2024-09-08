import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>, // Assuming CategoryRepository is a custom repository
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return new ApiResponse<Category>(
      201,
      'Category created successfully',
      new Date(),
      await this.categoryRepository.save(category),
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
      const skip = (page - 1) * size;
      const take = size;
      const whereOptions = search
        ? {
            name: ILike(`%${search}%`),
          }
        : {};

      const [members, total] = await this.categoryRepository.findAndCount({
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });
      return new ApiResponse<Category[]>(
        200,
        'Successfully found data',
        new Date(),
        members,
        {
          page,
          limit: size,
          totalPage: Math.ceil(total / size),
          totalData: total,
        },
      );
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving users',
      );
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return new ApiResponse<Category>(
      200,
      'Successfully found data',
      new Date(),
      category,
    );
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.update(id, updateCategoryDto);
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return new ApiResponse<Category>(
      200,
      'Successfully updated data',
      new Date(),
      category,
    );
  }

  async remove(id: number) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.remove(existingCategory);
    return new ApiResponse<Category>(
      200,
      'Successfully removed data',
      new Date(),
      null,
    );
  }
}
