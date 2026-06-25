import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateAppointmentDto } from './Dto/create-appointment.dto';
import { AppointmentStatus } from './appointment.schema';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PaginationDto } from 'src/common/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetAppointmentsPatientQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    status?: string;
}

export class GetAppointmentsDoctorQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    date?: string;
}

export class GetAppointmentsAdminQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    date?: string;

    @IsOptional()
    @IsString()
    doctor?: string;

    @IsOptional()
    @IsString()
    patient?: string;
}

@Controller('appointments')
export class AppointmentsController {
    constructor(private appointmentServices: AppointmentsService,
                 private doctorsService: DoctorsService) {}

    @Post()
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    create(@Request() req, @Body() dto: CreateAppointmentDto) {
        return this.appointmentServices.create(req.user._id, dto);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    findByPatient(@Request() req, @Query() query: GetAppointmentsPatientQueryDto) {
        return this.appointmentServices.findByPatient(req.user._id, query.status, query);
    }

    @Get('doctor')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    async findByDoctor(
        @Request() req,
        @Query() query: GetAppointmentsDoctorQueryDto,
    ) {
        const doctor = await this.doctorsService.findByUser(req.user._id);
        return this.appointmentServices.findByDoctor(doctor._id.toString(), query.status, query.date, query);
    }

    @Get()
    @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
    findAll(@Query() query: GetAppointmentsAdminQueryDto) {
        return this.appointmentServices.findAll(
            { status: query.status, doctor: query.doctor, patient: query.patient, date: query.date },
            query
        );
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    UpdateStatus(@Param('id') id: string, @Body('status') status: AppointmentStatus, @Body('notes') notes?: string) {
        return this.appointmentServices.updateStatus(id, status, notes);

    }
}
