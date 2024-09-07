import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageableDto } from 'src/common/dto/pageable.dto';
import { ApiMaster, ApiUser } from 'src/constant';
import { RolesGuard } from 'src/guard/roles.guard';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Request } from 'express';

@UseGuards(RolesGuard)
@Controller(ApiMaster)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('SUPER_ADMIN')
  @Post(ApiUser)
  create(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    const user = request.user as JwtPayload;
    createUserDto.createdBy = user.email;
    return this.userService.create(createUserDto);
  }
  @Roles('SUPER_ADMIN')
  @Get(ApiUser)
  findAll(@Query() query: PageableDto) {
    return this.userService.findAll(query);
  }
  @Roles('SUPER_ADMIN')
  @Get(ApiUser + ':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Roles('SUPER_ADMIN')
  @Patch(ApiUser + ':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const user = request.user as JwtPayload;
    updateUserDto.updatedBy = user.email;
    return this.userService.update(id, updateUserDto);
  }

  @Roles('SUPER_ADMIN')
  @Delete(ApiUser + ':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
