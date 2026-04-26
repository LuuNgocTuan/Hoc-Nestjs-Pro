import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    name: string;

    @Prop()
    phone: string;

    @Prop()
    age: number;

    @Prop()
    address: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    // @Prop()
    // deletedAt: Date;

    // @Prop()
    // isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 👇 GẮN plugin ở đây
UserSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

