import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll() {
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
