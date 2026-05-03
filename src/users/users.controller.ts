import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from './users.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ResponseMessage('Tạo mới người dùng thành công')
    async create(
        // @Body('email') myEmail: string, //cái @Body() này để lấy dữ liệu từ body request như nodejs là req.body
        // @Body('password') myPassword: string,
        // @Body('name')
        @Body() createDto: CreateUserDto, @User() user: IUser

    ) {
        console.log('check DTO:', createDto);
        const createdUser = await this.usersService.create(createDto, user);
        return {
            _id: createdUser._id,
            createdAt: createdUser.createdAt,
        }
        // return this.usersService.create(myEmail, myPassword, myName);
    }

    @Get()
    @ResponseMessage('Lấy danh sách người dùng phân trang thành công')
    async findAll(
        @Query('current') page: number = 1,
        @Query('pageSize') limit: number = 10,
        @Query() qs: string
    ) {
        return await this.usersService.findAll(page, limit, qs);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        // @Param() params: any //cái @Param() này để lấy dữ liệu từ params url như nodejs là req.params
        return this.usersService.findById(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật thông tin người dùng thành công')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
        return await this.usersService.update(id, updateUserDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Xóa người dùng thành công')
    async remove(@Param('id') id: string, @User() user: IUser) {
        return await this.usersService.remove(id, user);
    }
}
