import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './doctor.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Doctor.name,schema:DoctorSchema}
    ])
  ],
  providers: [DoctorsService],
  controllers: [DoctorsController],
  exports: [DoctorsService, MongooseModule], 
})
export class DoctorsModule {}
