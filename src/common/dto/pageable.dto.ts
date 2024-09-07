import { IsOptional, IsInt, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PageableDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  size?: number = 10;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  direction?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsString()
  search?: string;
}
