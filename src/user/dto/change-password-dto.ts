import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Masukan user id' })
  userId: string;
  @IsNotEmpty({ message: 'Masukan password baru' })
  @MinLength(8, { message: 'Kata sandi harus memiliki minimal 8 karakter' })
  newPassword: string;
}
