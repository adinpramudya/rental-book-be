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
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { ApiBorrow, ApiMaster } from 'src/constant';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { PageableDto } from 'src/common/dto/pageable.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller(ApiMaster)
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post(ApiBorrow)
  create(@Body() createBorrowDto: CreateBorrowDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    createBorrowDto.createdBy = user.email;
    return this.borrowService.create(createBorrowDto);
  }

  @Get(ApiBorrow)
  findAll(@Query() query: PageableDto) {
    return this.borrowService.findAll(query);
  }

  @Get(ApiBorrow + '/:id')
  findOne(@Param('id') id: string) {
    return this.borrowService.findOne(+id);
  }

  @Patch(ApiBorrow + '/:id')
  update(
    @Param('id') id: string,
    @Body() updateBorrowDto: UpdateBorrowDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    updateBorrowDto.updatedBy = user.email;
    return this.borrowService.update(+id, updateBorrowDto);
  }

  @Delete(ApiBorrow + '/:id')
  remove(@Param('id') id: string) {
    return this.borrowService.remove(+id);
  }
}
