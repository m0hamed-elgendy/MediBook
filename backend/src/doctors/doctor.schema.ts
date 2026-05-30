import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DoctorDocument = Doctor & Document;


@Schema({ timestamps: true })
export class Doctor {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    user!: Types.ObjectId

    @Prop({ required: true })
    specialty!: string

    @Prop({ required: true})
    bio!: string

    @Prop({ required: true })
    phone!: string

    @Prop({ required: true })
    address!: string

    @Prop({ default: 0 })
    rating?: number

    @Prop({ required: true })
    consultationPrice!: number;

    @Prop({ type: [String], default: [] })
    symptoms?: string[]

    @Prop({ type: [String], default: [] })
    services?: string[]

    @Prop({
        type: [
            {
                day: String,
                from: String,
                to: String,
            },
        ],
        default: []
    })

    availability?: { day: string, from: string, to: string }[]
    

    @Prop({ default: 20 })
    sessionDuration?: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const DoctorSchema=SchemaFactory.createForClass(Doctor)