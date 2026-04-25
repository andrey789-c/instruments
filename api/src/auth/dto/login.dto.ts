import { IsString, IsEmail, MinLength, Matches, IsBoolean, IsOptional } from 'class-validator';
 
export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;
 
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(1, { message: 'Пароль не может быть пустым' })
  @Matches(/^[^\s]+$/, {
    message: 'Пароль не должен содержать пробелы',
  })
  password: string;
 
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
 