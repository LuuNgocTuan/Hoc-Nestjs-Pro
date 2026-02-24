import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(
        // @Body('email') myEmail: string, //cái @Body() này để lấy dữ liệu từ body request như nodejs là req.body
        // @Body('password') myPassword: string,
        // @Body('name')
        @Body() createUserDto: CreateUserDto

    ) {
        console.log('check DTO:', createUserDto);
        return this.usersService.create(createUserDto);
        // return this.usersService.create(myEmail, myPassword, myName);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        // @Param() params: any //cái @Param() này để lấy dữ liệu từ params url như nodejs là req.params
        return this.usersService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
