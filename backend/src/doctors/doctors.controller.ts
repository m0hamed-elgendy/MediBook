import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './create-doctor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('doctors')
export class DoctorsController {
    constructor(private doctorServices: DoctorsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    create(@Request() req, @Body() dto: CreateDoctorDto) {
        return this.doctorServices.create(req.user._id, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
    findAll(@Query() pagination: PaginationDto) {
        return this.doctorServices.findAll(pagination);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    getProfile(@Request() req) {
        return this.doctorServices.findByUser(req.user._id)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.doctorServices.findOne(id);
    }
    @Patch(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    update(@Param('id') id: string, @Body() dto: Partial<CreateDoctorDto>) {
        return this.doctorServices.update(id, dto);
    }

    @Patch(':id/approve')
    @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
    approveDoctor(@Param('id') id: string) {
        return this.doctorServices.approveDoctor(id);
    }

    @Get(':id/admin')
    @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
    findOneForAdmin(@Param('id') id: string) {
        return this.doctorServices.findOneForAdmin(id);
    }

}
