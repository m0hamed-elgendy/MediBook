import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './Dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name)
    private userModel:Model<UserDocument>
 ){}

 async findByEmail(email:string):Promise<UserDocument|null>{
   return await this.userModel.findOne({email});

 }

 async findById(id:string):Promise<UserDocument|null>{
    return await this.userModel.findById(id)
 }

 async create(dto:CreateUserDto):Promise<UserDocument|null>{
     return await this.userModel.create(dto);
 }


}
