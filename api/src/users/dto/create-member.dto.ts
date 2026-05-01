import { IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateMemberDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Минимум 6 символов' })
  password: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Некорректный номер телефона' })
  phone: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN'], { message: 'Роль может быть USER или ADMIN' })
  role?: 'USER' | 'ADMIN';
}
