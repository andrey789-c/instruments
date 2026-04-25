import { IsString, MinLength, MaxLength, IsNumber, Min, IsUUID, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddItemDto {
  @IsUUID()
  tableId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(0)
  @MaxLength(500)
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;
}