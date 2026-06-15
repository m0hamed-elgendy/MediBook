import { IsNotEmpty, IsString } from "class-validator";

export class CreateDoctorApplicationDto {
    @IsNotEmpty()
    @IsString()
    specialty!:string

    @IsNotEmpty()
    @IsString()
    licenseImage!:string
}