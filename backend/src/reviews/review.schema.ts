import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Appointment } from "src/appointments/appointment.schema";
import { Doctor } from "src/doctors/doctor.schema";
import { User } from "src/users/user.schema";

export type ReviewDocument = Review & Document
@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    patient!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Doctor.name, required: true })
    doctor!: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref: Appointment.name,
        required: true,
    })
    appointment!: Types.ObjectId;


    @Prop({ required: true, min: 1, max: 5 })
    rating!: number

   

    @Prop()
    comment?: string

}

export const ReviewSchema = SchemaFactory.createForClass(Review)