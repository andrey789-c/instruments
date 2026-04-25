import { IsString, MaxLength, IsNumber, Min, IsUUID, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateItemDto {
  @IsUUID()
  itemId: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity?: number;
}