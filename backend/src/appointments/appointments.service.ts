import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor } from 'src/doctors/doctor.schema';
import { appiontmentDocument, Appointment, AppointmentStatus } from './appointment.schema';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './Dto/create-appointment.dto';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PaginationDto } from 'src/common/pagination.dto';

/**
 * Converts a 12-hour AM/PM time string (e.g. "02:30 PM") to total minutes since midnight.
 */
function parseTimeToMinutes(time: string): number {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours !== 12) hours += 12;
    return hours * 60 + minutes;
}

@Injectable()
export class AppointmentsService {

    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<appiontmentDocument>,
        private doctorServices: DoctorsService
    ) { }

    async create(PatientId: string, dto: CreateAppointmentDto): Promise<appiontmentDocument> {
        const doctor = await this.doctorServices.findOne(dto.doctor);
        if (!doctor) throw new NotFoundException('Doctor not found');

        // #1: Patient can't book themselves
        if (doctor.user.toString() === PatientId) {
            throw new BadRequestException('You cannot book an appointment with yourself');
        }

        // #2: Doctor must be active
        if (!doctor.isActive) {
            throw new BadRequestException('This doctor is not currently accepting appointments');
        }



        // #3: Validate appointment date is today or in the future
        const appointmentDate = new Date(dto.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        appointmentDate.setHours(0, 0, 0, 0);
        if (appointmentDate < today) {
            throw new BadRequestException('Appointment date must be today or in the future');
        }

        // #4: If booking today, ensure the time hasn't already passed
        const now = new Date();
        if (appointmentDate.getTime() === today.getTime()) {
            const appointmentMinutes = parseTimeToMinutes(dto.time);
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            if (appointmentMinutes <= currentMinutes) {
                throw new BadRequestException('Cannot book an appointment in the past. Please choose a later time');
            }
        }

        // #5: Check doctor availability on this day
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[appointmentDate.getDay()];

        if (!doctor.availability || doctor.availability.length === 0) {
            throw new BadRequestException('This doctor has no availability set');
        }

        const availableSlot = doctor.availability.find(
            a => a.day.toLowerCase() === dayName.toLowerCase()
        );
        if (!availableSlot) {
            throw new BadRequestException(`Doctor is not available on ${dayName}`);
        }

        // #6: Check time is within the doctor's working hours
        const appointmentMinutes = parseTimeToMinutes(dto.time);
        const slotFromMinutes = parseTimeToMinutes(availableSlot.from);
        const slotToMinutes = parseTimeToMinutes(availableSlot.to);
        if (appointmentMinutes < slotFromMinutes || appointmentMinutes > slotToMinutes) {
            throw new BadRequestException(
                `Appointment time must be between ${availableSlot.from} and ${availableSlot.to} on ${dayName}`
            );
        }

        // #7: Prevent patient double-booking (same patient, same date & time, any doctor)
        const patientConflict = await this.appointmentModel.findOne({
            patient: PatientId,
            date: dto.date,
            time: dto.time,
            status: { $nin: [AppointmentStatus.CANCELLED] }
        });
        if (patientConflict) {
            throw new BadRequestException('You already have an appointment at this date and time');
        }

        // #8: Prevent doctor slot conflict (same doctor, same date & time)
        const doctorConflict = await this.appointmentModel.findOne({
            doctor: dto.doctor,
            time: dto.time,
            date: dto.date,
            status: { $nin: [AppointmentStatus.CANCELLED] }
        });
        if (doctorConflict) {
            throw new BadRequestException('This slot is already booked');
        }

        return this.appointmentModel.create({
            ...dto,
            patient: PatientId
        });

    }

    async findByPatient(patientId: string, status?: string, pagination?: PaginationDto) {
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;
        const filter: any = { patient: patientId };
        if (status) filter.status = status;

        const [data, total] = await Promise.all([
            this.appointmentModel.find(filter)
                .populate('doctor')
                .populate('patient', 'name email')
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            this.appointmentModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByDoctor(doctorId: string, status?: string, date?: string, pagination?: PaginationDto) {
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;
        const filter: any = { doctor: doctorId };
        if (status) filter.status = status;
        if (date) filter.date = date;

        const [data, total] = await Promise.all([
            this.appointmentModel.find(filter)
                .populate('patient', 'name email')
                .sort({ date: 1 })
                .skip(skip)
                .limit(limit),
            this.appointmentModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findAll(filters: { status?: string, doctor?: string, patient?: string, date?: string }, pagination?: PaginationDto) {
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;
        const filter: any = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) filter[key] = filters[key];
        });

        const [data, total] = await Promise.all([
            this.appointmentModel.find(filter)
                .populate('doctor')
                .populate('patient', 'name email')
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            this.appointmentModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateStatus(id: string, status: AppointmentStatus, notes?: string): Promise<appiontmentDocument> {
        const appointment = await this.appointmentModel.findByIdAndUpdate(
            id,
            { status, ...(notes && { notes }) },
            { new: true },
        );
        if (!appointment) throw new NotFoundException('Appointment not found');
        return appointment;
    }



}




