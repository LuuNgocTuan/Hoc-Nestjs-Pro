import { Reflector } from '@nestjs/core';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPassword } from 'src/auth/utils/password.util';
import type { SoftDeleteModel } from 'mongoose-delete';
import type { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import { isMongoDuplicateError } from 'src/common/helpers/mongo-error.helper';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
    constructor(@InjectModel(UserM.name) private UserModel: SoftDeleteModel<UserDocument>) { }

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

    async create(createDto: CreateUserDto, @User() user: IUser) {
        const { name, email, password, age, gender, address } = createDto;

        //check email đã tồn tại chưa
        const existingUser = await this.UserModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException(`Email ${email} đã tồn tại`);
        }

        //tiếp tục tạo user mới
        //hash password trước khi lưu vào database
        const hashedPassword = await hashPassword(password);
        const newUser = await this.UserModel.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            address,
            role: 'USER', // mặc định role là USER khi tạo mới
            company: {
                _id: user._id,
                name: user.name
            },
            createdBy: {
                _id: user._id,
                email: user.email
            }
        });
        return newUser;
    }

    async register(registerUserDto: RegisterUserDto) {
        const { name, email, password, age, gender, address } = registerUserDto;

        //check email đã tồn tại chưa
        const existingUser = await this.UserModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException(`Email ${email} đã tồn tại`);
        }

        //tiếp tục tạo user mới
        //hash password trước khi lưu vào database
        const hashedPassword = await hashPassword(password);
        const user = await this.UserModel.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            address,
            role: 'USER' // mặc định role là USER khi đăng ký
        });
        return user;
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, projection, population } = aqp(qs);
        delete filter.page;
        delete filter.limit;

        // Tính toán phân trang
        const offset = (currentPage - 1) * limit;
        const defaultLimit = limit ? +limit : 10;

        const totalItems = await this.UserModel.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        // Thực hiện truy vấn với phân trang, sắp xếp, lọc và populate
        const users = await this.UserModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .select('-password -refreshToken')
            .populate(population)
            .exec();

        return {
            pagination: {
                current: currentPage, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems // tổng số phần tử (số bản ghi)
            },
            results: users,
        };
    }

    findOneByUsername(username: string) {
        return this.UserModel.findOne({
            email: username
        });
    }

    async findById(id: string) {
        // return `This action returns a #${id} user`;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user'; // Hoặc bạn có thể trả về một lỗi hoặc giá trị mặc định khác
        }
        const user = await this.UserModel
            .findById(id)
            .select('-password -refreshToken'); // loại bỏ trường password khỏi kết quả trả về
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
        //tìm user theo id trong database, this là để truy cập đến class UserModel đã được inject ở constructor, findById là method của mongoose để tìm document theo _id, id là tham số truyền vào hàm findOne
    }

    async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
        // return `This action updates a #${id} user`;
        try {
            // 1. Check user tồn tại
            const existingUser = await this.UserModel.findById(id);
            if (!existingUser) {
                throw new NotFoundException('User not found');
            }

            // 2. Check email trùng (nếu có update email)
            if (updateUserDto.email) {
                const emailExists = await this.UserModel.findOne({
                    email: updateUserDto.email,
                    _id: { $ne: id }, // loại trừ chính nó
                });

                if (emailExists) {
                    throw new BadRequestException(`Email ${updateUserDto.email} đã tồn tại`);
                }
                // 3. Update user
                const result = await this.UserModel.findByIdAndUpdate(
                    id,
                    {
                        ...updateUserDto,
                        updatedBy: {
                            _id: user._id,
                            email: user.email,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    },
                );

                return result;
            }
        } catch (error: unknown) {
            // 5. Bắt lỗi duplicate key từ DB (race condition)
            if (isMongoDuplicateError(error)) {
                throw new BadRequestException(`Email ${updateUserDto.email} đã tồn tại`);
            }
            throw error;
        }
    }


    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user';
        }
        await this.UserModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email
                }
            }
        );
        return this.UserModel.delete({ _id: id });

        // return `This action removes a #${id} user`;
    }

    updateUserToken = async (id: string, refreshToken: string) => {
        await this.UserModel.updateOne(
            { _id: id },
            { refreshToken }

        );
    }

    findUserByToken = async (refreshToken: string) => {
        return await this.UserModel.findOne(
            { refreshToken }
        );
    }

}
