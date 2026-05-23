import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post()
    @ResponseMessage('Tạo một công việc thành công')
    create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
        return this.jobsService.create(createJobDto, user);
    }

    @Get()
    @ResponseMessage('Lấy tất cả công việc phân trang')
    findAll(
        @Query('current') currentPage: number,
        @Query('pageSize') limit: number,
        @Query() qs: string
    ) {
        return this.jobsService.findAll(currentPage, limit, qs);
    }

    @Get(':id')
    @ResponseMessage('Tìm kiếm công việc thành công')
    async findOne(@Param('id') id: string) {
        return await this.jobsService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật công việc thành công')
    async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
        return await this.jobsService.update(id, updateJobDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Xóa công việc thành công')
    async remove(@Param('id') id: string, @User() user: IUser) {
        return await this.jobsService.remove(id, user);
    }
}
