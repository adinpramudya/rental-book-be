import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsEmail({}, { message: 'Alamat email tidak valid' })
  @IsNotEmpty({ message: 'Alamat email tidak boleh kosong' })
  email: string;

  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  @MinLength(8, { message: 'Kata sandi harus memiliki minimal 8 karakter' })
  password: string;

  @IsOptional()
  isActive: boolean = false;

  role: Role;

  @IsOptional()
  createdBy: string;
}
