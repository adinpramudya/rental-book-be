import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nama Tidak Boleh Kosong' })
  name: string;

  description: string;
  createdBy: string;
}
