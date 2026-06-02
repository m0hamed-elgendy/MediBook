import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type appiontmentDocument = Appointment & Document

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Appointment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    patient!: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
    doctor!: Types.ObjectId

    @Prop({ required: true })
    date!: string

    @Prop({ required: true })
    time!: string;

    @Prop({ type: String, enum: AppointmentStatus, default: AppointmentStatus.PENDING })
    status!: AppointmentStatus

    @Prop()
    notes?: string;


}

export const appointmentSchema = SchemaFactory.createForClass(Appointment)