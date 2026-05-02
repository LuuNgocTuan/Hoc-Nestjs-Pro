import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService

    ) { }

    @Public()// @Public() này để đánh dấu route này là public, tức là không cần phải đăng nhập vẫn có thể truy cập vào route này, nếu không có @Public() thì route này sẽ bị bảo vệ bởi JwtAuthGuard và chỉ có những người đã đăng nhập mới có thể truy cập vào route này
    @UseGuards(LocalAuthGuard)//@UseGuards này để sử dụng guard bảo vệ route, ở đây mình sử dụng LocalAuthGuard để bảo vệ route login, nếu không có guard này thì route login sẽ không được bảo vệ và bất cứ ai cũng có thể truy cập vào route này mà không cần phải đăng nhập
    @ResponseMessage('User Login')
    @Post('login')
    async login(@Request() req) {
        // return { message: 'Login successful' };
        return this.authService.login(req.user);
    }

    // @UseGuards(JwtAuthGuard) // @UseGuards này để sử dụng guard bảo vệ route, ở đây mình sử dụng JwtAuthGuard để bảo vệ route profile, nếu không có guard này thì route profile sẽ không được bảo vệ và bất cứ ai cũng có thể truy cập vào route này mà không cần phải đăng nhập. Tuy nhiên, vì mình đã sử dụng global guard trong main.ts nên mình không cần phải sử dụng @UseGuards(JwtAuthGuard) ở đây nữa, route profile sẽ tự động được bảo vệ bởi JwtAuthGuard mà không cần phải sử dụng @UseGuards(JwtAuthGuard) ở đây nữa

    @Public()
    @ResponseMessage('Đăng ký thành công')
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Get('profile')
    getProfile(@Request() req) {
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
