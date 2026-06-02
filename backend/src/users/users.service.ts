import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './Dto/create-user.dto';
import { CloudinaryService } from '../cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });

  }

  async findById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id)
  }

  async create(dto: CreateUserDto): Promise<UserDocument | null> {
    return await this.userModel.create(dto);
  }

  async updateProfileImage(userId: string, file: Express.Multer.File): Promise<UserDocument> {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

}
