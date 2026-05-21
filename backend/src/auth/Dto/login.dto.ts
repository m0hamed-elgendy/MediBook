import { IsEmail, IsNotEmpty, Matches, MinLength, minLength } from "class-validator";

export class LoginDto{
    @IsNotEmpty()
    @IsEmail()
    email!:string

    @IsNotEmpty()
    @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message: 'password must contain uppercase, number and special character',
  })

    password!:string
}