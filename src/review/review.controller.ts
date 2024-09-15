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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiMaster, ApiReview } from 'src/constant';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { PageableDto } from 'src/common/dto/pageable.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller(ApiMaster)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(ApiReview)
  create(@Body() createReviewDto: CreateReviewDto, @Req() request: Request) {
    const user = request.user as JwtPayload;
    createReviewDto.createdBy = user.email;
    return this.reviewService.create(createReviewDto);
  }

  @Get(ApiReview)
  findAll(@Query() query: PageableDto) {
    return this.reviewService.findAll(query);
  }

  @Get(ApiReview + '/:id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(ApiReview + '/:id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() request: Request,
  ) {
    const user = request.user as JwtPayload;
    updateReviewDto.updatedBy = user.email;
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(ApiReview + '/:id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
