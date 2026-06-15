import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { UserRole } from "../user.schema";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @Matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, {
        message: 'name must contain only letters',
    })
    name!: string


    @IsNotEmpty()
    @IsEmail()
    email!: string


    @IsNotEmpty()
    @IsString()
    phone!: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/, {
        message: 'password must contain uppercase, number and special character',
    })
    password!: string;

    @IsNotEmpty()
    @IsEnum(UserRole, {
        message: 'role must be patient or doctor',
    })

    role!: UserRole
}