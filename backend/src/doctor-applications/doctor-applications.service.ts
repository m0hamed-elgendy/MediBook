import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus, DoctorApplication, DoctorApplicationDocument } from './doctor-application.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDoctorApplicationDto } from './Dto/create-doctor-application.dto';
import { User, UserDocument, UserRole } from 'src/users/user.schema';

@Injectable()
export class DoctorApplicationsService {
    constructor(
        @InjectModel(DoctorApplication.name)
        private doctorApllictionModel: Model<DoctorApplicationDocument>,

        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ) { }

    async create(userId: string, dto: CreateDoctorApplicationDto) {
        const user = await this.userModel.findById(userId)
        if (!user) throw new NotFoundException('User not found')
        if (!user.isActive) throw new ForbiddenException('Your account is blocked')
        const existingApplication = await this.doctorApllictionModel.findOne({
            user: userId
        })

        if (existingApplication) {
            throw new BadRequestException(
                'You already have a doctor application',
            );
        }

        const application = await this.doctorApllictionModel.create({
            user: userId,
            status: ApplicationStatus.PENDING,
            ...dto,
        })

        return application;
    }

    async findAll() {
        return await this.doctorApllictionModel.
            find().
            populate('user', 'name phone').
            sort({ createdAt: 1 })
    }


    async approve(applicationId: string) {
        const application = await this.doctorApllictionModel.findById(applicationId);

        if (!application) {
            throw new NotFoundException('Application not found');
        }

        if (application.status !== ApplicationStatus.PENDING) {
            throw new BadRequestException(
                'Application already processed'
            );
        }

        application.status = ApplicationStatus.APPROVED;

        await application.save();

        await this.userModel.findByIdAndUpdate(
            application.user, {
            role: UserRole.DOCTOR
        }
        );

        return application.populate('user', 'name role')
    }


    async reject(
        applicationId: string,
        rejectionReason: string,
    ) {
        const application =
            await this.doctorApllictionModel.findById(applicationId);

        if (!application) {
            throw new NotFoundException(
                'Application not found',
            );
        }

        if (application.status !== ApplicationStatus.PENDING) {
            throw new BadRequestException(
                'Application already processed',
            );
        }

        application.status = ApplicationStatus.REJECTED;
        application.rejectionReason =
            rejectionReason ||
            'Your application does not meet the current requirements. Please review your information and apply again.';
        await application.save();

        return application.populate(
            'user',
            'name role',
        );
    }

}
