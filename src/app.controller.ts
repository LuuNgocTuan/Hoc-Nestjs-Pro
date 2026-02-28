import { ConfigService } from '@nestjs/config';
import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private configService: ConfigService,
        private authService: AuthService

    ) { }
    @UseGuards(LocalAuthGuard)//@UseGuards này để sử dụng guard bảo vệ route, ở đây mình sử dụng LocalAuthGuard để bảo vệ route login, nếu không có guard này thì route login sẽ không được bảo vệ và bất cứ ai cũng có thể truy cập vào route này mà không cần phải đăng nhập
    @Post('login')
    async login(@Request() req) {
        // return { message: 'Login successful' };
        return this.authService.login(req.user);
    }


    // @Get()//=>api (restfullAPI)
    // @Render('home')
    // handleHomePage() {
    //     console.log('check port 1:', this.configService.get('PORT'));

    //     const message = this.appService.getHello();
    //     return { mess: message };
    // }
}
