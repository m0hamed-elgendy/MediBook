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

  async create(dto: CreateUserDto): Promise<UserDocument> {
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

  async update(userId:string,data:Partial<User>):Promise<UserDocument|null>{
    const user=await this.userModel.findByIdAndUpdate(userId,data,{new:true})
    if(!user)
      throw new NotFoundException('User Not Found');

    return user;

  }



async findAll(filters: {
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  const { role, isActive, page = 1, limit = 2 } = filters;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive;

  const [data, total] = await Promise.all([
    this.userModel
      .find(filter)
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    this.userModel.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

async suspend(id: string): Promise<UserDocument> {
  const user = await this.userModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!user) throw new NotFoundException('User not found');
  return user;
}

}
