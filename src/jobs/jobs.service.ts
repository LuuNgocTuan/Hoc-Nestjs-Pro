import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import type { SoftDeleteModel } from 'mongoose-delete';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import aqp from 'api-query-params';

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
        return {
            _id: newJob._id,
            createdAt: newJob.createdAt,
        };
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, projection, population } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        const offset = (+currentPage - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;
        const totalItems = await this.JobModel.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.JobModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .select('-password') // loại bỏ trường password trong kết quả trả về
            .sort(sort as any)
            .populate(population)
            .exec();

        return {
            meta: {
                current: currentPage, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems, // tổng số phần tử (số bản ghi)
            },
            result, //kết quả query
        };
    }

    async findOne(id: string) {
        return await this.JobModel.findById(id);
    }

    async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
        const updatedJob = await this.JobModel.updateOne(
            { _id: id },
            {
                ...updateJobDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                }
            }
        )
        return updatedJob;
    }

    async remove(id: string, user: IUser) {
        const updatedJob = await this.JobModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                }
            })
        return await this.JobModel.delete({ _id: id });
    }
}
