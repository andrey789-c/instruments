import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class UpdateTableDto {
  @IsUUID()
  tableId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}