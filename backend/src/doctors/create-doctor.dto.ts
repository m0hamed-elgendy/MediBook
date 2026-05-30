import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AvailabilityDto {
  @IsNotEmpty()
  @IsString()
  day!: string;

  @IsNotEmpty()
  @IsString()
  from!: string;

  @IsNotEmpty()
  @IsString()
  to!: string;
}

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  specialty!: string;

  @IsNotEmpty()
  @IsString()
  bio!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  consultationPrice!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto[];

  @IsOptional()
  @IsNumber()
  @Min(5)
  sessionDuration?: number;
}