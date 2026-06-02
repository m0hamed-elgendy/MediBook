import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './review.schema';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Review.name,schema:ReviewSchema
      } ]),
      AppointmentsModule,
      DoctorsModule
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
