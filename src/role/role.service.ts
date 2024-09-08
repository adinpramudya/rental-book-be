import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ILike, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PageableDto } from 'src/common/dto/pageable.dto';
import { ApiResponse } from 'src/common/ApiResponse/api-response';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(query: PageableDto) {
    const {
      page = 1,
      direction = 'ASC',
      search,
      size = 10,
      sortBy = 'id',
    } = query;
    try {
      const take = size;
      const skip = (page - 1) * size;
      const whereOptions = search
        ? {
            name: ILike(`%${search}%`),
          }
        : {};
      const [roles, total] = await this.roleRepository.findAndCount({
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });
      return new ApiResponse<Role[]>(
        200,
        'Successfully found data',
        new Date(),
        roles,
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
    return this.roleRepository.find();
  }
  async findOne(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }
  async remove(id: number) {
    const existingRole = await this.roleRepository.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.roleRepository.remove(existingRole);
  }
}
