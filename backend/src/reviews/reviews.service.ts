import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './review.schema';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './Dto/create-review.dto';
import { DoctorsService } from 'src/doctors/doctors.service';
import { appiontmentDocument, Appointment, AppointmentStatus } from 'src/appointments/appointment.schema';
import { Doctor, DoctorDocument } from 'src/doctors/doctor.schema';
import { UpdateReviewDto } from './Dto/update-review.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class ReviewsService {

    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
        @InjectModel(Appointment.name) private appointmentModel: Model<appiontmentDocument>,
        @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
        private doctorService: DoctorsService
    ) {

    }

    async updateDoctorRating(doctorId: string) {
        const result = await this.reviewModel.aggregate([
            { $match: { doctor: new Types.ObjectId(doctorId) } },
            {
                $group: {
                    _id: '$doctor',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        await this.doctorModel.findByIdAndUpdate(doctorId, {
            averageRating: result[0]?.averageRating || 0,
            reviewsCount: result[0]?.totalReviews || 0
        });
    }

    async create(patientId: string, dto: CreateReviewDto): Promise<ReviewDocument> {
        const doctor = await this.doctorService.findOne(dto.doctor)
        if (!doctor) throw new NotFoundException('doctor not found');

        if (!doctor.isApproved) {
            throw new BadRequestException('This doctor is not approved yet');
        }

        const appointment = await this.appointmentModel.findOne({
            _id: dto.appointment,
            doctor: dto.doctor,
            patient: patientId,
            status: AppointmentStatus.COMPLETED
        })
        if (!appointment) {
            throw new BadRequestException(
                'You can only review doctors after completing an appointment with them'
            );
        }

        const existingReview = await this.reviewModel.findOne({
            appointment: dto.appointment
        })
        if (existingReview) {
            throw new BadRequestException(
                'You have already reviewed this appointment'
            );
        }

        const review = await this.reviewModel.create(
            {
                patient: patientId,
                doctor: dto.doctor,
                appointment: dto.appointment,
                rating: dto.rating,
                comment: dto.comment
            })

        await this.updateDoctorRating(dto.doctor)

        return review;
    }



    async GetDoctorRatings(doctorId: string, pagination?: PaginationDto) {
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;
        const doctor = await this.doctorService.findOne(doctorId);
        if (!doctor) throw new NotFoundException('doctor not found');

        const filter = { doctor: doctorId };
        const [data, total] = await Promise.all([
            this.reviewModel.find(filter)
                .populate('doctor', 'name email averageRating reviewsCount')
                .populate('patient', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            this.reviewModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async UpdateRatingForDoctor(
        patientId: string,
        ReviewId: string,
        dto: UpdateReviewDto
    ): Promise<ReviewDocument> {

        const review = await this.reviewModel.findOne({
            _id: ReviewId,
            patient: patientId
        });

        if (!review) {
            throw new NotFoundException('Review Not Found');
        }

        // update safely
        if (dto.rating !== undefined) {
            review.rating = dto.rating;
        }

        if (dto.comment !== undefined) {
            review.comment = dto.comment;
        }

        await review.save();

        // recalculate doctor rating
        await this.updateDoctorRating(review.doctor.toString());

        return review;
    }

    async DeleteRating(patientId: string, ReviewId: string) {

        const deletedReview = await this.reviewModel.findOneAndDelete({
            _id: ReviewId,
            patient: patientId
        });

        if (!deletedReview) {
            throw new NotFoundException('Review Not Found');
        }

        await this.updateDoctorRating(deletedReview.doctor.toString());

        return deletedReview;
    }

    async findByPatient(patientId: string, pagination?: PaginationDto) {
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;

        const filter = { patient: patientId };
        const [data, total] = await Promise.all([
            this.reviewModel.find(filter)
                .populate('doctor', 'name email averageRating reviewsCount')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            this.reviewModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getDoctorRatingsSummary(doctorId: string) {

        const doctor = await this.doctorService.findOne(doctorId);
        if (!doctor) throw new NotFoundException('doctor not found');

        const result = await this.reviewModel.aggregate([
            {
                $match: { doctor: new Types.ObjectId(doctorId) }
            },
            {
                $group: {
                    _id: '$doctor',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        return {
            averageRating: result[0]?.averageRating || 0,
            totalReviews: result[0]?.totalReviews || 0
        };
    }
}
