import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiCategory, ApiMaster } from 'src/constant';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { PageableDto } from 'src/common/dto/pageable.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
@Controller(ApiMaster)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(ApiCategory)
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    createCategoryDto.createdBy = user.email;
    return this.categoryService.create(createCategoryDto);
  }

  @Get(ApiCategory)
  findAll(@Query() query: PageableDto) {
    return this.categoryService.findAll(query);
  }

  @Get(ApiCategory + '/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(ApiCategory + '/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    updateCategoryDto.updatedBy = user.email;
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(ApiCategory + '/:id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
