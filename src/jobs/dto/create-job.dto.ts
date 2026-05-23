import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";
import { JobStatus } from "../schemas/job.schema";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty()
    name: string;
}

class UserActionDto {

    @IsMongoId({
        message: '_id không hợp lệ',
    })
    _id: string;

    @IsEmail(
        {},
        {
            message: 'Email không hợp lệ',
        },
    )
    email: string;
}

export class CreateJobDto {
    @IsNotEmpty({
        message: 'Name không được để trống',
    })
    name: string;

    @IsNotEmpty({
        message: 'Skills không được để trống',
    })
    @IsArray({ message: 'Skills phải là một mảng' })
    @IsString({ each: true, message: 'Mỗi skill phải là một chuỗi' })
    skills: string[];

    @IsNotEmpty({
        message: 'Location không được để trống',
    })
    location: string;

    @IsNotEmpty({
        message: 'Salary không được để trống',
    })
    salary: number;

    @IsNotEmpty({
        message: 'Quantity không được để trống',
    })
    quantity: string;

    @IsNotEmpty({
        message: 'Description không được để trống',
    })
    description: string;

    @IsNotEmpty({
        message: 'StartDate không được để trống',
    })
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate({ message: 'StartDate phải là một ngày hợp lệ' })
    startDate: Date;

    @IsNotEmpty({
        message: 'EndDate không được để trống',
    })
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate({ message: 'EndDate phải là một ngày hợp lệ' })
    endDate: Date;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    /*
   |--------------------------------------------------------------------------
   | ACTIVE
   |--------------------------------------------------------------------------
   */

    @IsOptional()
    @IsBoolean({
        message: 'isActive phải là boolean',
    })
    isActive?: boolean;

    /*
   |--------------------------------------------------------------------------
   | STATUS
   |--------------------------------------------------------------------------
   */

    @IsOptional()
    @IsEnum(JobStatus, {
        message:
            'status phải là ACTIVE | INACTIVE | MAINTENANCE | EXPIRED | DELETED',
    })
    status?: JobStatus;

    /*
   |--------------------------------------------------------------------------
   | TIME
   |--------------------------------------------------------------------------
   */

    @IsOptional()
    @IsDateString(
        {},
        {
            message: 'expiredAt không đúng định dạng ISO Date',
        },
    )
    expiredAt?: Date;

    /*
    |--------------------------------------------------------------------------
    | REASON
    |--------------------------------------------------------------------------
    */

    @IsOptional()
    @IsString()
    inactiveReason?: string;

    /*
    |--------------------------------------------------------------------------
    | USER ACTION
    |--------------------------------------------------------------------------
    */

    @IsOptional()
    @ValidateNested()
    @Type(() => UserActionDto)
    activatedBy?: UserActionDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => UserActionDto)
    deactivatedBy?: UserActionDto;
}
