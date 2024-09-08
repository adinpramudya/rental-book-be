import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';
import { ILike, Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {}
  async create(createPublisherDto: CreatePublisherDto) {
    const publisher = this.publisherRepository.create(createPublisherDto);
    return new ApiResponse<Publisher>(
      201,
      'Publisher created successfully',
      new Date(),
      await this.publisherRepository.save(publisher),
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

      const [publishers, total] = await this.publisherRepository.findAndCount({
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });
      return new ApiResponse<Publisher[]>(
        200,
        'Successfully found data',
        new Date(),
        publishers,
        {
          page,
          limit: size,
          totalPage: Math.ceil(total / size),
          totalData: total,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving publisher',
      );
    }
  }

  async findOne(id: number) {
    const publisher = await this.publisherRepository.findOne({
      where: { id },
    });
    if (!publisher) {
      throw new NotFoundException('No publisher found with id: ' + id);
    }
    return new ApiResponse<Publisher>(
      200,
      'Successfully found data',
      new Date(),
      publisher,
    );
  }

  async update(id: number, updatePublisherDto: UpdatePublisherDto) {
    const existingPublisher = await this.publisherRepository.findOne({
      where: { id },
    });

    if (!existingPublisher) {
      throw new NotFoundException('No publisher found with id: ' + id);
    }
    await this.publisherRepository.update(id, updatePublisherDto);
    const publisher = await this.publisherRepository.findOne({
      where: { id },
    });
    return new ApiResponse<Publisher>(
      200,
      'Publisher updated successfully',
      new Date(),
      publisher,
    );
  }

  async remove(id: number) {
    const existingPublisher = await this.publisherRepository.findOne({
      where: { id },
    });
    if (!existingPublisher) {
      throw new NotFoundException('No publisher found with id: ' + id);
    }
    await this.publisherRepository.remove(existingPublisher);
    return new ApiResponse<Publisher>(
      200,
      'Publisher deleted successfully',
      new Date(),
      null,
    );
  }
}
