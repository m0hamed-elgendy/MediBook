import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './create-doctor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationDto } from 'src/common/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetDoctorsQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    specialty?: string;
}

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
    findAll(@Query() query: GetDoctorsQueryDto) {
        return this.doctorServices.findAll(query, query.search, query.specialty);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    getProfile(@Request() req) {
        return this.doctorServices.findByUser(req.user._id)
    }

    @Get('dashboard')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    getDoctorDashboard(@Request() req) {
        return this.doctorServices.getDoctorDashboard(req.user._id)
    }

    @Get('dashboard/today')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    getTodaySchedule(@Request() req) {
        return this.doctorServices.getTodaySchedule(req.user._id);
    }

    @Get('dashboard/reviews')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    getRecentReviews(@Request() req) {
        return this.doctorServices.getRecentReviews(req.user._id);
    }

    @Get('dashboard/monthly')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    getMonthlyAppointments(@Request() req) {
        return this.doctorServices.getMonthlyAppointments(req.user._id);
    }

    @Get('dashboard/status')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    getAppointmentStatusDistribution(@Request() req) {
        return this.doctorServices.getAppointmentStatusDistribution(req.user._id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.doctorServices.findOne(id);
    }

    @Get(':id/busy')
    getBusySlots(@Param('id') id: string, @Query('date') date: string) {
        return this.doctorServices.getBusySlots(id, date);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    update(@Param('id') id: string, @Body() dto: Partial<CreateDoctorDto>) {
        return this.doctorServices.update(id, dto);
    }

    @Get(':id/admin')
    @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
    findOneForAdmin(@Param('id') id: string) {
        return this.doctorServices.findOneForAdmin(id);
    }
}

