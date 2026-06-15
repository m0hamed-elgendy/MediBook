import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class RejectDoctorApplicationDto {

    @IsNotEmpty()
    @IsString()
    rejectionReason!: string;

}
