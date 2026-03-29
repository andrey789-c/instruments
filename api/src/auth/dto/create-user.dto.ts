import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsIn,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Минимум 6 символов' })
  password: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'SUPERADMIN'], {
    message: 'Роль может быть только USER, ADMIN или SUPERADMIN',
  })
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN';

  @IsString({ message: 'Организация должна быть строкой' })
  @IsOptional()
  organizationName: string;

  // ── НОВОЕ ПОЛЕ ─────────────────────────────────────────────────────────
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Введите корректный номер телефона (только цифры, 10-15 знаков)',
  })
  phone?: string;
  // ───────────────────────────────────────────────────────────────────────
}