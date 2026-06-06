import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/users/Dto/create-user.dto';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './Dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService

    ) { }

    private async generateToken(user: UserDocument) {
        const payload = {
            sub: user._id.toString(),
            role: user.role
        };

        const accessToken = await this.jwtService.signAsync(payload);

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES')! as any,
        });

        return { accessToken, refreshToken }
    }




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

        const token = await this.generateToken(user)

        await this.userService.update(user._id.toString(), {
            refreshToken: token.refreshToken

        })


        return {
            token,
            user: {
                id: user!._id,
                name: user!.name,
                email: user!.email,
                role: user!.role,
            }
        }

    }

    async logIn(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const validPassword = await bcrypt.compare(dto.password, user.password)
        if (!validPassword) throw new UnauthorizedException('Invalid email or password')

        const token = await this.generateToken(user);
        await this.userService.update(user._id.toString(),
            {
                refreshToken: token.refreshToken
            }
        )
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

    async refresh(refreshToken: string) {
        // 1. Verify the token
        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // 2 - Get the username from the DB

        const user = await this.userService.findById(payload.sub);
        if (!user) throw new UnauthorizedException('User Not Found');

        // 3 - Check that the Refresh Token is in the DB
        if (user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Refresh token is invalid or expired');
        }

        const tokens = await this.generateToken(user);

        await this.userService.update(user._id.toString(), {
            refreshToken: tokens.refreshToken
        });

        return tokens;
    }

    async logout(userId: string) {
        await this.userService.update(userId, { refreshToken: null })
        return { message: 'Logged out successfully' };
    }


}
