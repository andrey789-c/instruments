import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  resetToken: string; // выдаётся после успешной проверки OTP

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Минимум 6 символов' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Пароль должен содержать заглавную букву, строчную букву и цифру',
  })
  password: string;
}