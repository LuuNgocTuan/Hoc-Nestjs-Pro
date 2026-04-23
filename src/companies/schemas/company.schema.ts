import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
    @Prop()
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop()
    description: string;

    @Prop({
        type: {
            _id: { type: Types.ObjectId },
            email: String,
        },
    })
    createdBy: {
        _id: Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);