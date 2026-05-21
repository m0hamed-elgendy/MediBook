import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/Dto/create-user.dto';
import { LoginDto } from './Dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authServices:AuthService){}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto:CreateUserDto){
        return this.authServices.register(dto)
    }

    
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto:LoginDto){
        return this.authServices.logIn(dto)
    }

}
