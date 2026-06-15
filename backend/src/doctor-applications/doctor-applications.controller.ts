import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DoctorApplicationsService } from './doctor-applications.service';
import { CreateAppointmentDto } from 'src/appointments/Dto/create-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateDoctorApplicationDto } from './Dto/create-doctor-application.dto';
import { RejectDoctorApplicationDto } from './Dto/reject-doctor-aplliction.dto';


@Controller('doctor-applications')
export class DoctorApplicationsController {

    constructor(private applicationServices: DoctorApplicationsService) { }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    @Post()
    create(@Request() req, @Body() dto: CreateDoctorApplicationDto) {
        return this.applicationServices.create(req.user._id, dto)
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    @UseGuards(
        JwtAuthGuard,
        new RolesGuard(['admin']),
    )
    findAll() {
        return this.applicationServices.findAll();
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id/approve')
    @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
    approve(@Param('id') id: string) {
        return this.applicationServices.approve(id);

    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id/reject')
    @UseGuards(
        JwtAuthGuard,
        new RolesGuard(['admin']),
    )
    reject(
        @Param('id') id: string,
        @Body() dto: RejectDoctorApplicationDto,
    ) {
        return this.applicationServices.reject(
            id,
            dto.rejectionReason,
        );
    }


}

