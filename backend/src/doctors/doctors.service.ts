import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import { CreateDoctorDto } from './create-doctor.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { appiontmentDocument, Appointment, AppointmentStatus } from 'src/appointments/appointment.schema';
import { Review, ReviewDocument } from 'src/reviews/review.schema';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<appiontmentDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
  ) { }

  async create(userId: string, dto: CreateDoctorDto): Promise<DoctorDocument> {
    return this.doctorModel.create({ ...dto, user: userId });
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: DoctorDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const filter = { isActive: true, isApproved: true };
    const [data, total] = await Promise.all([
      this.doctorModel
        .find(filter)
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit),
      this.doctorModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<DoctorDocument> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid doctor ID');
    const doctor = await this.doctorModel.findOne(
      {
        _id: id,
        isApproved: true,
        isActive: true
      }
    ).populate('user', 'name email');
    if (!doctor) throw new NotFoundException('Doctor not found');

    return doctor;
  }

  async findOneForAdmin(id: string): Promise<DoctorDocument> {
    const doctor = await this.doctorModel.findById(id).populate('user', 'name email');
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;

  }

  async findByUser(userId: string): Promise<DoctorDocument> {
    const doctor = await this.doctorModel.findOne({ user: userId, isActive: true, isApproved: true }).populate('user', 'name email');
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async update(id: string, dto: Partial<CreateDoctorDto>): Promise<DoctorDocument> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid doctor ID');
    const doctor = await this.doctorModel.findByIdAndUpdate(id, dto, { new: true });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }



  async getReviewStats(doctorId: string) {
    const result = await this.reviewModel.aggregate([
      {
        $match: {
          doctor: new Types.ObjectId(doctorId)
        }
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: '$rating'
          },
          totalReviews: {
            $sum: 1
          }
        }
      }
    ]);

    return {
      averageRating: Number(
        (result[0]?.averageRating || 0).toFixed(1)
      ),
      totalReviews: result[0]?.totalReviews || 0
    };
  }

  async getDoctorDashboard(userId: string) {
    const doctor = await this.doctorModel.findOne({ user: userId });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const doctorId = doctor._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];

    const [
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      reviewStats,
    ] = await Promise.all([
      this.appointmentModel.countDocuments({ doctor: doctorId }),
      this.appointmentModel.countDocuments({ doctor: doctorId, date: todayStr }),
      this.appointmentModel.countDocuments({ doctor: doctorId, status: AppointmentStatus.PENDING }),
      this.appointmentModel.countDocuments({ doctor: doctorId, status: AppointmentStatus.CONFIRMED }),
      this.appointmentModel.countDocuments({ doctor: doctorId, status: AppointmentStatus.COMPLETED }),
      this.appointmentModel.countDocuments({ doctor: doctorId, status: AppointmentStatus.CANCELLED }),
      this.reviewModel!.aggregate([
        { $match: { doctor: doctorId } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      averageRating: reviewStats[0]?.averageRating
        ? Number(reviewStats[0].averageRating.toFixed(1))
        : 0,
      totalReviews: reviewStats[0]?.totalReviews || 0,
    };
  }

  async getTodaySchedule(userId: string) {

    const doctor = await this.doctorModel.findOne({ user: userId });
    if (!doctor) throw new NotFoundException('Doctor not found');
    const todayStr = new Date().toISOString().split('T')[0];

    return this.appointmentModel.find({
      doctor: doctor._id,
      date: todayStr
    }).populate('patient', 'name email profileImage')
      .sort({ time: 1 });
  }

  async getRecentReviews(userId: string, limit: number = 5) {
    const doctor = await this.doctorModel.findOne({ user: userId });
    if (!doctor) throw new NotFoundException('Doctor Not Found');

    return await this.reviewModel.find({ doctor: doctor._id }).
      populate('patient', 'name profileImage').sort({ createdAt: -1 }).limit(limit)
  }

  async getMonthlyAppointments(userId: string) {
    const doctor = await this.doctorModel.findOne({ user: userId });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await this.appointmentModel.aggregate([
      {
        $match: {
          doctor: doctor._id,
        }
      },
      {
        $addFields: {
          dateConverted: { $dateFromString: { dateString: '$date' } }
        }
      },
      {
        $match: {
          dateConverted: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$dateConverted' },
            year: { $year: '$dateConverted' },
          },
          count: { $sum: 1 },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          count: 1,
        }
      }
    ]);

    return result;
  }

  async getAppointmentStatusDistribution(userId: string) {
    const doctor = await this.doctorModel.findOne({ user: userId });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const result = await this.appointmentModel.aggregate([
      { $match: { doctor: doctor._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        }
      }
    ]);

    return result;
  }


}