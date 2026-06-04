import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateReviewDto } from './Dto/create-review.dto';
import { DoctorsService } from 'src/doctors/doctors.service';
import { UpdateReviewDto } from './Dto/update-review.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private reviewServices: ReviewsService,
        private doctorServices: DoctorsService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    create(@Request() req, @Body() dto: CreateReviewDto) {
        return this.reviewServices.create(req.user._id, dto)
    }

    @Get('doctor/:doctorId')
    async getDoctorRatings(@Param('doctorId') doctorId: string, @Query() pagination: PaginationDto) {
        return this.reviewServices.GetDoctorRatings(doctorId, pagination)
    }

    @Get('doctor/:doctorId/summary')
    async getDoctorRatingsSummary(@Param('doctorId') doctorId: string) {
        return this.reviewServices.getDoctorRatingsSummary(doctorId)
    }

    @Get('my-reviews')
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    async getMyReviews(@Request() req, @Query() pagination: PaginationDto) {
        return this.reviewServices.findByPatient(req.user._id, pagination)
    }

    @Get('my-rating')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    async getMyRating(@Request() req, @Query() pagination: PaginationDto) {
        const doctor = await this.doctorServices.findByUser(req.user._id);
        return this.reviewServices.GetDoctorRatings(doctor._id.toString(), pagination)
    }

    @Get('my-rating/summary')
    @UseGuards(JwtAuthGuard, new RolesGuard(['doctor']))
    async getMyRatingSummary(@Request() req) {
        const doctor = await this.doctorServices.findByUser(req.user._id);
        return this.reviewServices.getDoctorRatingsSummary(doctor._id.toString())
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    updateReview(@Request() req, @Param('id') reviewId: string, @Body() dto: UpdateReviewDto) {
        return this.reviewServices.UpdateRatingForDoctor(req.user._id, reviewId, dto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard, new RolesGuard(['patient']))
    deleteReview(@Request() req, @Param('id') reviewId: string) {
        return this.reviewServices.DeleteRating(req.user._id, reviewId)
    }

}

