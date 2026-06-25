import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsMongoId()
    doctor!:string

    @IsNotEmpty()
    @IsDateString()
    date!:string
     
    @IsNotEmpty()
    @IsString()
    @Matches(/^(0[1-9]|1[0-2]):[0-5]\d\s(AM|PM)$/, {
        message: 'Time must be in hh:mm AM/PM format (e.g. 09:30 AM, 02:00 PM)',
    })
    time!:string

    @IsOptional()
    @IsString()
    notes?: string;
}