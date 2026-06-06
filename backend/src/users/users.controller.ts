import { Controller, Get, Param, Patch, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUsersDto } from './Dto/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Patch('profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfileImage(req.user._id, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  findAll(@Query() dto: GetUsersDto) {
    return this.usersService.findAll(dto);
  }

  @Patch(':id/suspend')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  suspend(@Param('id') id: string) {
    return this.usersService.suspend(id);
  }

}