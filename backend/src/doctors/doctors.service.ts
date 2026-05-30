import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import { CreateDoctorDto } from './create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(userId: string, dto: CreateDoctorDto): Promise<DoctorDocument> {
    return this.doctorModel.create({ ...dto, user: userId });
  }

  async findAll(): Promise<DoctorDocument[]> {
    return this.doctorModel.find({ isActive: true }).populate('user', 'name email');
  }

  async findOne(id: string): Promise<DoctorDocument> {
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
    const doctor = await this.doctorModel.findByIdAndUpdate(id, dto, { new: true });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }
}