import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, appointmentSchema } from './appointment.schema';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:Appointment.name,schema:appointmentSchema
    }]),
    DoctorsModule

  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService, MongooseModule],

})
export class AppointmentsModule {}
