import { IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}
