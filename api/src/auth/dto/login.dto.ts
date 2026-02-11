import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(1, { message: 'Пароль не может быть пустым' })
  @Matches(/^[^\s]+$/, {
    message: 'Пароль не должен содержать пробелы',
  })
  password: string;
}