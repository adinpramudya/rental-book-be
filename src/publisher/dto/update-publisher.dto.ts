import { PartialType } from '@nestjs/mapped-types';
import { CreatePublisherDto } from './create-publisher.dto';
import { IsOptional } from 'class-validator';

export class UpdatePublisherDto extends PartialType(CreatePublisherDto) {
  @IsOptional()
  name?: string;
}
