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
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiMaster, ApiPublisher } from 'src/constant';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { PageableDto } from 'src/common/dto/pageable.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller(ApiMaster)
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post(ApiPublisher)
  create(@Body() createPublisherDto: CreatePublisherDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    createPublisherDto.createdBy = user.email;
    return this.publisherService.create(createPublisherDto);
  }

  @Get(ApiPublisher)
  findAll(@Query() query: PageableDto) {
    return this.publisherService.findAll(query);
  }

  @Get(ApiPublisher + '/:id')
  findOne(@Param('id') id: string) {
    return this.publisherService.findOne(+id);
  }

  @Patch(ApiPublisher + '/:id')
  update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    updatePublisherDto.updatedBy = user.email;
    return this.publisherService.update(+id, updatePublisherDto);
  }

  @Delete(ApiPublisher + '/:id')
  remove(@Param('id') id: string) {
    return this.publisherService.remove(+id);
  }
}
