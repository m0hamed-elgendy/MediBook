import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';

class AvailabilityDto {
  @IsNotEmpty()
  @IsString()
  day!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2]):[0-5]\d\s(AM|PM)$/, {
    message: 'from must be in hh:mm AM/PM format (e.g. 09:00 AM, 02:30 PM)',
  })
  from!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2]):[0-5]\d\s(AM|PM)$/, {
    message: 'to must be in hh:mm AM/PM format (e.g. 09:00 AM, 02:30 PM)',
  })
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