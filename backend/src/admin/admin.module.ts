import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { Doctor, DoctorSchema } from 'src/doctors/doctor.schema';
import { Appointment, appointmentSchema } from 'src/appointments/appointment.schema';
import { Review, ReviewSchema } from 'src/reviews/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Appointment.name, schema: appointmentSchema },
      { name: Review.name, schema: ReviewSchema },

    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }

