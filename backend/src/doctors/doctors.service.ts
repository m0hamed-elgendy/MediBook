import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import { CreateDoctorDto } from './create-doctor.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
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

    const [data, total] = await Promise.all([
      this.doctorModel
        .find({ isActive: true })
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit),
      this.doctorModel.countDocuments({ isActive: true }),
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
    const doctor = await this.doctorModel.findById(id).populate('user', 'name email');
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async findByUser(userId: string): Promise<DoctorDocument> {
    const doctor = await this.doctorModel.findOne({ user: userId }).populate('user', 'name email');
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async update(id: string, dto: Partial<CreateDoctorDto>): Promise<DoctorDocument> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid doctor ID');
    const doctor = await this.doctorModel.findByIdAndUpdate(id, dto, { new: true });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }
}