import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PageableDto } from 'src/common/dto/pageable.dto';
import { ApiResponse } from 'src/common/ApiResponse/api-response';
import { ChangePasswordDto } from './dto/change-password-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const password = createUserDto.password;
    const passwordHash = await bcrypt.hash(password, saltOrRounds);
    createUserDto.password = passwordHash;
    const user = this.userRepository.create(createUserDto);
    return new ApiResponse<User>(
      201,
      'Successfully Created data',
      new Date(),
      await this.userRepository.save(user),
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
            name: Like(`%${search}%`),
            email: Like(`%${search})%`),
          }
        : {};
      const [users, total] = await this.userRepository.findAndCount({
        where: whereOptions,
        order: {
          [sortBy]: direction,
        },
        skip,
        take,
      });
      return new ApiResponse<User[]>(
        200,
        'Successfully found data',
        new Date(),
        users,
        {
          page,
          limit: size,
          totalPage: Math.ceil(total / size),
          totalData: total,
        },
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'An error occurred while retrieving users',
      );
    }
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      return new NotFoundException(`User ${id} does not exist`);
    }

    return new ApiResponse<User>(
      200,
      'Successfully found data',
      new Date(),
      user,
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      return new NotFoundException(`User ${id} does not exist`);
    }
    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOne({ where: { id: id } });

    return new ApiResponse<User>(
      200,
      'Successfully updated data',
      new Date(),
      user,
    );
  }

  async remove(id: string) {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(existingUser);
    return new ApiResponse<User>(
      200,
      'Successfully removed data',
      new Date(),
      null,
    );
  }

  async findOneByUsernameOrEmail(data: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: data }, { email: data }],
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(
        `User dengan username atau email ${data} tidak ditemukan`,
      );
    }
    return user;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userRepository.findOneBy({
        id: changePasswordDto.userId,
      });
      if (!user) {
        return { success: false, message: 'User not found.' };
      }

      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );
      user.password = hashedPassword;
      await this.userRepository.save(user);

      return { success: true, message: 'Password successfully changed.' };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, message: 'Failed to change password.' };
    }
  }
}
