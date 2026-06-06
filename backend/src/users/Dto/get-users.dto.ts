import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/users/user.schema';

export class GetUsersDto {

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number;
}