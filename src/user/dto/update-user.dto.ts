import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Alamat email tidak valid' })
  email?: string;

  @IsOptional()
  @MinLength(8, { message: 'Kata sandi harus memiliki minimal 8 karakter' })
  password?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  updatedBy: string;
}
