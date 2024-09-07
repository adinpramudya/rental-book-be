import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsOptional({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsOptional({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsOptional({ message: 'Alamat tidak boleh kosong' })
  address: string;

  @IsOptional({ message: 'Nomor telepon tidak boleh kosong' })
  phoneNumber: string;

  @IsOptional()
  profilePhoto: string;

  @IsOptional()
  updatedBy: string;
}
