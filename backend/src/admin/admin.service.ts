import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { count } from 'console';
import { Model } from 'mongoose';
import { appiontmentDocument, Appointment, AppointmentStatus } from 'src/appointments/appointment.schema';
import { Doctor, DoctorDocument } from 'src/doctors/doctor.schema';
import { Review, ReviewDocument } from 'src/reviews/review.schema';
import { User, UserDocument, UserRole } from 'src/users/user.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
        @InjectModel(Appointment.name) private appointmentModel: Model<appiontmentDocument>,
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
    ) { }

    private calculatePercentage(count: number, total: number): number {
        return total === 0
            ? 0
            : Number(((count / total) * 100).toFixed(1));
    }

    async getDashboardStats() {
        const [
            totalUsers,
            totalDoctors,
            totalPatients,
            activeUsers,
            inactiveUsers,
            totalAppointments,
            pendingAppointments,
            confirmedAppointments,
            completedAppointments,
            cancelledAppointments,
            totalReviews,
        ] = await Promise.all([
            this.userModel.countDocuments(),
            this.userModel.countDocuments({ role: UserRole.DOCTOR }),
            this.userModel.countDocuments({ role: UserRole.PATIENT }),
            this.userModel.countDocuments({ isActive: true }),
            this.userModel.countDocuments({ isActive: false }),
            this.appointmentModel.countDocuments(),
            this.appointmentModel.countDocuments({ status: AppointmentStatus.PENDING }),
            this.appointmentModel.countDocuments({ status: AppointmentStatus.CONFIRMED }),
            this.appointmentModel.countDocuments({ status: AppointmentStatus.COMPLETED }),
            this.appointmentModel.countDocuments({ status: AppointmentStatus.CANCELLED }),
            this.reviewModel.countDocuments(),
        ]);
        return {
            totalUsers,
            doctors: {
                count: totalDoctors,
                percentage: this.calculatePercentage(totalDoctors, totalUsers)
            },
            patients: {
                count: totalPatients,
                percentage: this.calculatePercentage(totalPatients, totalUsers)
            },

            activeUsers: {
                count: activeUsers,
                percentage: this.calculatePercentage(activeUsers, totalUsers)
            },
            inactiveUsers: {
                count: inactiveUsers,
                percentage: this.calculatePercentage(inactiveUsers, totalUsers)
            },
            totalAppointments,
            pendingAppointments: {
                count: pendingAppointments,
                percentage: this.calculatePercentage(pendingAppointments, totalAppointments)
            },
            completed: {
                count: completedAppointments,
                percentage: this.calculatePercentage(
                    completedAppointments,
                    totalAppointments
                )
            },

            cancelled: {
                count: cancelledAppointments,
                percentage: this.calculatePercentage(
                    cancelledAppointments,
                    totalAppointments
                )
            },
            confirmedAppointments: {
                count: confirmedAppointments,
                percentage: this.calculatePercentage(
                    confirmedAppointments,
                    totalAppointments
                )
            },
            totalReviews,
        }
    }

    async getReviewsStats() {
        const result = await this.reviewModel.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        return {
            averageRating: result[0]?.averageRating
                ? Number(result[0].averageRating.toFixed(1))
                : 0,

            totalReviews: result[0]?.totalReviews || 0
        };
    }

    async getAppointmentsAnalytics() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const [byDay, byMonth] = await Promise.all([

            this.appointmentModel.aggregate([
                {
                    $addFields: {
                        dateConverted: { $dateFromString: { dateString: '$date' } },
                    },
                },
                {
                    $match: {
                        dateConverted: { $gte: sixMonthsAgo },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfWeek: '$dateConverted' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),

            this.appointmentModel.aggregate([
                {
                    $addFields: {
                        dateConverted: { $dateFromString: { dateString: '$date' } },
                    },
                },
                {
                    $match: {
                        dateConverted: { $gte: sixMonthsAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            month: { $month: '$dateConverted' },
                            year: { $year: '$dateConverted' },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]),
        ]);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return {
            byDay: byDay.map(d => ({
                day: days[d._id - 1],
                count: d.count,
            })),
            byMonth: byMonth.map(m => ({
                month: m._id.month,
                year: m._id.year,
                count: m.count,
            })),
        };
    }

    async getTopDoctors(limit: number = 5) {
        const topDoctors = await this.appointmentModel.aggregate([
            { $match: { status: AppointmentStatus.COMPLETED } },
            {
                $group:
                {
                    _id: '$doctor',
                    totalAppointments: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'doctors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctorInfo'
                }
            },
            {
                $unwind: '$doctorInfo'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorInfo.user',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },

            // Stage 7: رتّب من الأكتر للأقل
            {
                $sort: { totalAppointments: -1 }
            },

            // Stage 8: خد أول limit
            {
                $limit: limit
            },

            // Stage 9: شكّل الـ Response
            {
                $project: {
                    _id: 0,
                    doctorId: '$_id',
                    name: '$userInfo.name',
                    specialty: '$doctorInfo.specialty',
                    totalAppointments: 1,
                    averageRating: '$doctorInfo.averageRating',
                }
            }
        ]);
        return topDoctors;

    }

    async getDoctorsBySpecialty() {
        return this.doctorModel.aggregate([
            {
                $group: {
                    _id: '$specialty',
                    count: { $sum: 1 },
                }
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id: 0,
                    specialty: '$_id',
                    count: 1,
                }
            }
        ]);
    }

}
