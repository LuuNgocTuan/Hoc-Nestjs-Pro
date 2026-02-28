import { ConfigService } from '@nestjs/config';
import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService,
        private configService: ConfigService
    ) { }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        // return { message: 'Login successful' };
        return req.user;
    }


    // @Get()//=>api (restfullAPI)
    // @Render('home')
    // handleHomePage() {
    //     console.log('check port 1:', this.configService.get('PORT'));

    //     const message = this.appService.getHello();
    //     return { mess: message };
    // }
}
