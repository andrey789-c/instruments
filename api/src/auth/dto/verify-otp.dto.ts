import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'Код должен состоять из 6 цифр' })
  code: string;
}