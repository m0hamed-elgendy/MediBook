import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor } from 'src/doctors/doctor.schema';
import { appiontmentDocument, Appointment, AppointmentStatus } from './appointment.schema';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './Dto/create-appointment.dto';
import { DoctorsService } from 'src/doctors/doctors.service';

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
            const [hours, minutes] = dto.time.split(':').map(Number);
            const appointmentTime = new Date();
            appointmentTime.setHours(hours, minutes, 0, 0);
            if (appointmentTime <= now) {
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
        if (dto.time < availableSlot.from || dto.time > availableSlot.to) {
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

    async findByPatient(patientId: string, status?: string): Promise<appiontmentDocument[]> {
        const filter: any = { patient: patientId };
        if (status) filter.status = status;
        return this.appointmentModel.find(filter).
            populate('doctor').
            populate('patient', 'name email')
            .sort({ date: -1 })
    }

async findByDoctor(doctorId: string, status?: string, date?: string): Promise<appiontmentDocument[]> {
    const filter: any = { doctor: doctorId };
    if (status) filter.status = status;
    if (date) filter.date = date;
    return this.appointmentModel.find(filter)
        .populate('patient', 'name email')
        .sort({ date: 1 });
}

    async findAll(filters: { status?: string, doctor?: string, patient?: string, date?: string }): Promise<appiontmentDocument[]> {
        const filter: any = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) filter[key] = filters[key];
        });
        return this.appointmentModel.find(filter)
            .populate('doctor')
            .populate('patient', 'name email')
            .sort({ date: -1 });
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




