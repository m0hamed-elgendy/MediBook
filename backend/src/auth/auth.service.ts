import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/users/Dto/create-user.dto';
import { UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './Dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService

    ) { }
    async register(dto: CreateUserDto) {
        const exists = await this.userService.findByEmail(dto.email);
        if (exists) throw new ConflictException('Account already exists');

        const hashed = await bcrypt.hash(dto.password, 10);

        const user = await this.userService.create(
            {
                ...dto,
                password: hashed
            }
        )

        const token = await this.jwtService.sign({ sub: user?._id, role: user?.role })


        return {
            token,
            user: {
                id:user!._id,
                name: user!.name,
                email: user!.email,
                role: user!.role,
            }
        }

    }

    async logIn(dto:LoginDto){
        const user=await this.userService.findByEmail(dto.email)
        if(!user) throw new UnauthorizedException('Invalid email or password');
         
        const validPassword=await bcrypt.compare(dto.password,user.password)
        if(!validPassword) throw new UnauthorizedException('Invalid email or password')
        
        const token=this.jwtService.sign({sub:user._id,role:user.role})
                return {
            token,
            user: {
                id: user._id,
                name: user!.name,
                email: user!.email,
                role: user!.role,
            }
        }
    }
}
