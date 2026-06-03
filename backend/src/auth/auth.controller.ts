import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/Dto/create-user.dto';
import { LoginDto } from './Dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authServices: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: CreateUserDto) {
        return this.authServices.register(dto)
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authServices.logIn(dto)
    }

    @Get('Profile')
    @UseGuards(JwtAuthGuard)
    async profile(@Request() req) {
        return req.user;
    }

    @Get('admin-only')
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    async admin() {
        return 'admin-only'
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@Body('refreshToken') refreshToken: string) {
        return this.authServices.refresh(refreshToken);
    }

    @Post('Logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    logout(@Request() req){
        this.authServices.logout(req.user._id)
    }
}
