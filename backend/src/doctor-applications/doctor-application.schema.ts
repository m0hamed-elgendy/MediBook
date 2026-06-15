import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { Document, Types } from "mongoose";

export type DoctorApplicationDocument = DoctorApplication & Document;
export enum ApplicationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',

}
@Schema({ timestamps: true })
export class DoctorApplication {

    @Prop({type:Types.ObjectId,ref:'User',required:true,unique:true})
    user!:Types.ObjectId

    @Prop({required:true,type:String})
    specialty!:string

    @Prop({required:true})
    licenseImage!:string

    @Prop({type:String,enum:ApplicationStatus,default:ApplicationStatus.PENDING})
    status!:ApplicationStatus

    @Prop()
    rejectionReason?: string;
}

export const DoctorApplicationSchema =SchemaFactory.createForClass(DoctorApplication)