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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiMaster, ApiTransaction } from 'src/constant';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { PageableDto } from 'src/common/dto/pageable.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller(ApiMaster)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post(ApiTransaction)
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    createTransactionDto.createdBy = user.email;
    return this.transactionService.create(createTransactionDto);
  }

  @Get(ApiTransaction)
  findAll(@Query() query: PageableDto) {
    return this.transactionService.findAll(query);
  }

  @Get(ApiTransaction + '/:id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(ApiTransaction + '/:id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    updateTransactionDto.updatedBy = user.email;
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(ApiTransaction + '/:id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
