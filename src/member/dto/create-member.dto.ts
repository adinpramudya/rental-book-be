import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  address: string;

  @IsNotEmpty({ message: 'Nomor telepon tidak boleh kosong' })
  phoneNumber: string;

  profilePhoto: string;

  @IsOptional()
  createdBy: string;
}
