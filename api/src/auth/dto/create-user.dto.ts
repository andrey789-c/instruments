import { 
  IsString, 
  IsEmail, 
  MinLength, 
  MaxLength, 
  IsOptional, 
  IsIn,
  IS_OPTIONAL
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'SUPERADMIN'], { 
    message: 'Роль может быть только USER, ADMIN или SUPERADMIN' 
  })
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN';

  @IsString({ message: 'Организация должна быть строкой' })
  @IsOptional()
  organizationName: string
}