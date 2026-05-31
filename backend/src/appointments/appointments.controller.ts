import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateAppointmentDto } from './Dto/create-appointment.dto';
import { AppointmentStatus } from './appointment.schema';
import { DoctorsService } from 'src/doctors/doctors.service';

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
    findByPatient(@Request() req, @Query('status') status?: string) {
        return this.appointmentServices.findByPatient(req.user._id, status);
    }
    @Get('doctor')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    async findByDoctor(
        @Request() req,
        @Query('status') status?: string,
        @Query('date') date?: string,
    ) {
        const doctor = await this.doctorsService.findByUser(req.user._id);
        return this.appointmentServices.findByDoctor(doctor._id.toString(), status, date);
    }

    @Get()
    @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
    findAll(
        @Query('status') status?: string,
        @Query('date') date?: string,
        @Query('doctor') doctor?: string,
        @Query('patient') patient?: string,
    ) {
        return this.appointmentServices.findAll({ status, doctor, patient, date });
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    UpdateStatus(@Param('id') id: string, @Body('status') status: AppointmentStatus, @Body('notes') notes?: string) {
        return this.appointmentServices.updateStatus(id, status, notes);

    }
}
