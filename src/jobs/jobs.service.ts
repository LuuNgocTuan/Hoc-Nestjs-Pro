import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import type { SoftDeleteModel } from 'mongoose-delete';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';

@Injectable()
export class JobsService {
    constructor(@InjectModel(Job.name) private JobModel: SoftDeleteModel<JobDocument>) { }

    async create(createJobDto: CreateJobDto, user: IUser) {
        const { name, skills, location, salary, quantity, description, startDate, endDate, company, isActive, status, expiredAt, inactiveReason, activatedBy, deactivatedBy } = createJobDto;
        const newJob = await this.JobModel.create(
            {
                ...createJobDto,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                }
            });
        // return 'This action adds a new job';
    }

    findAll() {
        return `This action returns all jobs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} job`;
    }

    update(id: number, updateJobDto: UpdateJobDto) {
        return `This action updates a #${id} job`;
    }

    remove(id: number) {
        return `This action removes a #${id} job`;
    }
}
