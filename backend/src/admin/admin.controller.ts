import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('dashboard')
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('dashboard/reviews-stats')
    getReviewsStats() {
        return this.adminService.getReviewsStats();
    }

    @Get('dashboard/appointments-analytics')
    getAppointmentsAnalytics() {
        return this.adminService.getAppointmentsAnalytics();
    }

    @Get('dashboard/top-doctors')
    getTopDoctors() {
        return this.adminService.getTopDoctors();
    }

    @Get('dashboard/getDoctorsBySpecialty')
    getDoctorsBySpecialty(){
        return this.adminService.getDoctorsBySpecialty();
    }

}
