import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { CloudinaryModule } from 'src/cloudinary.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    CloudinaryModule,

  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]

})
export class UsersModule { }
