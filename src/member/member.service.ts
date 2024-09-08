import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { ILike, Repository } from 'typeorm';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { PageableDto } from 'src/common/dto/pageable.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}
  async create(createMemberDto: CreateMemberDto) {
    const member = this.memberRepository.create(createMemberDto);
    return new ApiResponse<Member>(
      201,
      'Member created successfully',
      new Date(),
      await this.memberRepository.save(member),
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
            name: ILike(`%${search}%`),
            email: ILike(`%${search}%`),
          }
        : {};

      const [members, total] = await this.memberRepository.findAndCount({
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });
      return new ApiResponse<Member[]>(
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
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving users',
      );
    }
  }

  async findOne(id: string) {
    const member = await this.memberRepository.findOne({ where: { id: id } });

    if (!member) {
      return new NotFoundException(`Member ${id} not found`);
    }
    return new ApiResponse<Member>(
      200,
      'Successfully found data',
      new Date(),
      member,
    );
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const existingMember = await this.memberRepository.findOne({
      where: { id: id },
    });

    if (!existingMember) {
      throw new NotFoundException(`Member ${id} not found`);
    }
    await this.memberRepository.update(id, updateMemberDto);
    const member = await this.memberRepository.findOne({ where: { id: id } });

    return new ApiResponse<Member>(
      200,
      'Member updated successfully',
      new Date(),
      member,
    );
  }

  async remove(id: string) {
    const existingMember = await this.memberRepository.findOne({
      where: { id: id },
    });

    if (!existingMember) {
      throw new NotFoundException(`Member ${id} not found`);
    }
    await this.memberRepository.remove(existingMember);
    return new ApiResponse<Member>(
      200,
      'Member removed successfully',
      new Date(),
      null,
    );
  }
}
