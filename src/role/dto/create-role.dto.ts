import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Nama Tidak Boleh Kosong' })
  name: string;
  @IsOptional()
  createdBy: string;
}
