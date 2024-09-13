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
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBook, ApiMaster } from 'src/constant';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { PageableDto } from 'src/common/dto/pageable.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller(ApiMaster)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post(ApiBook)
  create(@Body() createBookDto: CreateBookDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    createBookDto.createdBy = user.email;
    return this.bookService.create(createBookDto);
  }

  @Get(ApiBook)
  findAll(@Query() query: PageableDto) {
    return this.bookService.findAll(query);
  }

  @Get(ApiBook + '/:id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(ApiBook + '/:id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    updateBookDto.updatedBy = user.email;
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(ApiBook + '/:id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
