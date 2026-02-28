import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPassword } from 'src/auth/utils/password.util';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

    // async getHashPassword(password: string): Promise<string> {
    //     const saltOrRounds = 10;
    //     const hash = await bcrypt.hash(password, saltOrRounds);
    //     return hash;
    // }

    // async create(email: string, password: string, name: string) {
    //     const hashPassword = await this.getHashPassword(password);
    //     const user = await this.UserModel.create({ email, password: hashPassword, name });
    //     return user;
    // }

    //không cần phải truyền từng tham số như email, password, name,... mà có thể truyền thẳng cả object createUserDto vào hàm create

    async create(DTO: CreateUserDto) {
        const hashedPassword = await hashPassword(DTO.password);
        const user = await this.UserModel.create({ email: DTO.email, password: hashedPassword, name: DTO.name, address: DTO.address, age: DTO.age });
        return user;
    }

    findAll() {
        return `This action returns all users`;
    }

    findOneByUsername(username: string) {
        return this.UserModel.findOne({
            email: username
        });
    }

    findById(id: string) {
        // return `This action returns a #${id} user`;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user'; // Hoặc bạn có thể trả về một lỗi hoặc giá trị mặc định khác
        }
        return this.UserModel.findById(id);
        //tìm user theo id trong database, this là để truy cập đến class UserModel đã được inject ở constructor, findById là hàm của mongoose để tìm theo id, id là tham số truyền vào hàm findOne
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        // return `This action updates a #${id} user`;
        return await this.UserModel.updateOne({ _id: id }, { ...updateUserDto });
    }

    remove(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user';
        }
        return this.UserModel.deleteOne({ _id: id });

        // return `This action removes a #${id} user`;
    }
}
