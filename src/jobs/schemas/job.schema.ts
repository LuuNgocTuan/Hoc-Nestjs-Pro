import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export type JobDocument = HydratedDocument<Job>;

export enum JobStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
    MAINTENANCE = 'MAINTENANCE',
    EXPIRED = 'EXPIRED',
}

class UserAction {

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop()
    email: string;
}

@Schema({ timestamps: true })
export class Job {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    skill: string[];

    @Prop({
        type: {
            _id: { type: Types.ObjectId },
            name: String,
        },
    })
    company?: {
        _id: Types.ObjectId;
        name: string;
    }

    @Prop()
    location: string;

    @Prop()
    salary: number;

    @Prop()
    quantity: number;

    @Prop()
    level: string;

    @Prop()
    description: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    /*
    |--------------------------------------------------------------------------
    | ACTIVE STATUS
    |--------------------------------------------------------------------------
    */

    @Prop({
        type: Boolean,
        required: true,
        default: true,
        index: true,
    })
    isActive: boolean;

    /*
    |--------------------------------------------------------------------------
    | STATUS
    |--------------------------------------------------------------------------
    */

    @Prop({
        type: String,
        enum: JobStatus,
        default: JobStatus.ACTIVE,
        required: true,
        index: true,
    })
    status: JobStatus;

    /*
    |--------------------------------------------------------------------------
    | AUDIT TIME
    |--------------------------------------------------------------------------
    */

    @Prop({
        default: Date.now,
    })
    activatedAt: Date;

    @Prop()
    deactivatedAt: Date;

    @Prop()
    expiredAt: Date;

    /*
    |--------------------------------------------------------------------------
    | WHO CHANGED STATUS
    |--------------------------------------------------------------------------
    */

    @Prop({
        type: UserAction,
    })
    activatedBy: UserAction;

    @Prop({
        type: UserAction,
    })
    deactivatedBy: UserAction;

    /*
    |--------------------------------------------------------------------------
    | REASON
    |--------------------------------------------------------------------------
    */

    @Prop()
    inactiveReason: string;

    /*
    |--------------------------------------------------------------------------
    | CREATED UPDATED
    |--------------------------------------------------------------------------
    */

    @Prop({
        type: UserAction,
    })
    createdBy: UserAction;

    @Prop({
        type: UserAction,
    })
    updatedBy: UserAction;

    @Prop({
        type: UserAction,
    })
    deletedBy: UserAction;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

/*
|--------------------------------------------------------------------------
| AUTO EXPIRE LOGIC (Tự động kiểm tra dữ liệu trước khi lưu document xuống MongoDB),trường hợp job đã hết hạn thì tự động chuyển trạng thái thành INACTIVE và cập nhật lý do hết hạn
|--------------------------------------------------------------------------
*/
JobSchema.pre('save', function (next) {

    if (this.expiredAt && this.expiredAt < new Date()) {

        this.isActive = false;

        this.status = JobStatus.EXPIRED;

        this.deactivatedAt = new Date();

        this.inactiveReason = 'Job expired automatically';
    }

});