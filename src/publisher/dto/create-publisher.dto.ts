import { IsNotEmpty } from 'class-validator';

export class CreatePublisherDto {
  @IsNotEmpty({ message: 'Nama Tidak Boleh Kosong' })
  name: string;
  address: string;
  createdBy: string;
}
