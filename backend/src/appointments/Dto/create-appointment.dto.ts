import { IsDateString, IsMongoId, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsMongoId()
    doctor!:string

    @IsNotEmpty()
    @IsDateString()
    date!:string
     
    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:mm format (e.g. 09:30, 14:00)',
    })
    time!:string
}