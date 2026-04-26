import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { Model, Types } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import type { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class CompaniesService {
    constructor(@InjectModel(Company.name) private CompanyModel: SoftDeleteModel<CompanyDocument>) { }
    async create(createCompanyDto: CreateCompanyDto, user: IUser) {
        const company = await this.CompanyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: new Types.ObjectId(user._id), // ✅ CHỈ dùng cái này
                email: user.email,
            }
        });
        return company;

        // return 'This action adds a new company';
    }

    findAll() {
        return `This action returns all companies`;
    }

    findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
        // return `This action updates a #${id} company`;
        return await this.CompanyModel.updateOne({ _id: id }, {
            ...updateCompanyDto,
            updatedBy: {
                _id: new Types.ObjectId(user._id),
                email: user.email,
            }
        });
    }

    async remove(id: string, user: IUser) {
        // return `This action removes a #${id} company`;
        return await this.CompanyModel.delete(
            { _id: id },
            {
                _id: new Types.ObjectId(user._id),
                email: user.email,
            }
        )
    }

}
