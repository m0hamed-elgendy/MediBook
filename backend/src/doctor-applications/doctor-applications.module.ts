import { Module } from '@nestjs/common';
import { DoctorApplicationsService } from './doctor-applications.service';
import { DoctorApplicationsController } from './doctor-applications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorApplication, DoctorApplicationSchema } from './doctor-application.schema';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DoctorApplication.name, schema: DoctorApplicationSchema,
      },
      {
        name:User.name,schema:UserSchema
      }
    ])

  ],
  providers: [DoctorApplicationsService],
  controllers: [DoctorApplicationsController],
  exports: [DoctorApplicationsService],

})
export class DoctorApplicationsModule { }
