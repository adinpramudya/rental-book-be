import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiMaster, ApiRole } from 'src/constant';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Roles } from 'src/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller(ApiMaster)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post(ApiRole)
  create(@Body() createRoleDto: CreateRoleDto, @Req() request: Request) {
    const user = request.user as JwtPayload;
    createRoleDto.createdBy = user.email;
    return this.roleService.create(createRoleDto);
  }

  @Get(ApiRole)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(ApiRole + '/:id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }
  @Patch(ApiRole + '/:id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() request: Request,
  ) {
    const user = request.user as JwtPayload;
    updateRoleDto.updatedBy = user.email;
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(ApiRole + '/:id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
