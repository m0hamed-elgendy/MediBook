import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string


  @Prop({ required: true, unique: true, lowercase: true })
  email!: string

  @Prop({ required: true })
  password!: string

  @Prop({ type: String, enum: UserRole, default: UserRole.PATIENT })
  role!: string

  @Prop({ default: null })
  profileImage?: string;

@Prop({ type: String, default: null })
refreshToken?: string|null;

  @Prop({ default: true })
  isActive: boolean = true;


}

export const UserSchema = SchemaFactory.createForClass(User);